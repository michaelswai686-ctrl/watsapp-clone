'use client';

import {
  Box,
  Flex,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  HStack,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
// import { useSocket } from '@/contexts/SocketContext';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  chatId: string;
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({ chatId, onSendMessage }: ChatWindowProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  // const { socket } = useSocket(); // Not used in polling mode

  const { data: fetchedMessages, mutate } = useSWR(
    chatId ? `/api/chats/${chatId}/messages` : null,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  /* Socket listener removed for SWR polling */
  /*
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      setMessages(prev => [...prev, {
        id: newMessage.id,
        content: newMessage.content,
        sender: newMessage.senderId,
        timestamp: new Date(newMessage.timestamp),
        status: 'delivered'
      }]);
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket]);
  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      content: message,
      sender: session?.user?.phoneNumber || '',
      timestamp: new Date(),
      status: 'sending'
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    try {
      await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.content,
          senderId: session?.user?.phoneNumber,
        }),
      });
      mutate(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ status: 'error', title: 'Failed to send' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex direction="column" h="100%">
      <Box
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
        bg="white"
        display="flex"
        alignItems="center"
      >
        <Avatar
          name="Chat"
          size="md"
          mr={3}
          bg="whatsapp.500"
          color="white"
        />
        <Box>
          <Text fontWeight="medium">Chat</Text>
          <Text fontSize="sm" color="gray.500">Online</Text>
        </Box>
      </Box>

      <Box
        flex={1}
        p={4}
        overflowY="auto"
        bg="gray.50"
      >
        <VStack spacing={4} align="stretch">
          {messages.map((msg) => {
            const isOwn = msg.sender === session?.user?.phoneNumber;

            return (
              <Flex
                key={msg.id}
                justify={isOwn ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={isOwn ? 'whatsapp.500' : 'white'}
                  color={isOwn ? 'white' : 'black'}
                  p={3}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text>{msg.content}</Text>
                  <Text
                    fontSize="xs"
                    mt={1}
                    opacity={0.7}
                    textAlign={isOwn ? 'right' : 'left'}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
              </Flex>
            );
          })}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box p={4} bg="white" borderTop="1px" borderColor="gray.200">
        <InputGroup>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            pr={20}
          />
          <InputRightElement width="auto">
            <HStack spacing={2} mr={2}>
              <IconButton
                aria-label="Attach file"
                icon={<FiPaperclip />}
                variant="ghost"
                size="sm"
              />
              <IconButton
                aria-label="Record voice"
                icon={<FiMic />}
                variant="ghost"
                size="sm"
              />
              <Button
                colorScheme="whatsapp"
                size="sm"
                onClick={handleSendMessage}
                leftIcon={<FiSend />}
              >
                Send
              </Button>
            </HStack>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
}
