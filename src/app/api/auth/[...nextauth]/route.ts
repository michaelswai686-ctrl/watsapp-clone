import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        phoneNumber: { label: 'Phone Number', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // In a real app, verify the OTP here
        // For demo purposes, we'll just check if OTP is '123456'
        if (credentials.otp === '123456') {
          const client = await clientPromise;
          const db = client.db();

          // Upsert user
          const result = await db.collection('users').findOneAndUpdate(
            { phoneNumber: credentials.phoneNumber },
            {
              $set: {
                phoneNumber: credentials.phoneNumber,
                name: `User ${credentials.phoneNumber.slice(-4)}`,
                updatedAt: new Date()
              },
              $setOnInsert: {
                createdAt: new Date()
              }
            },
            { upsert: true, returnDocument: 'after' }
          );

          const user = result;

          return {
            id: user?._id.toString() || credentials.phoneNumber,
            name: user?.name || credentials.phoneNumber,
            phoneNumber: user?.phoneNumber || credentials.phoneNumber,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.phoneNumber = token.phoneNumber;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
