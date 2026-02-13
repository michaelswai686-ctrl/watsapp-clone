import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const messages = await db.collection('messages')
      .find({ chatId: params.chatId })
      .sort({ timestamp: 1 })
      .toArray();

    const formattedMessages = messages.map(msg => ({
      ...msg,
      id: msg._id.toString()
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { content, senderId } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const newMessage = {
      chatId: params.chatId,
      content,
      sender: senderId,
      timestamp: new Date(),
      status: 'sent'
    };

    const result = await db.collection('messages').insertOne(newMessage);

    // Update chat's last message
    await db.collection('chats').updateOne(
      { _id: new ObjectId(params.chatId) },
      {
        $set: {
          lastMessage: {
            content,
            timestamp: newMessage.timestamp,
            sender: senderId
          }
        }
      }
    );

    return NextResponse.json({ ...newMessage, id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
