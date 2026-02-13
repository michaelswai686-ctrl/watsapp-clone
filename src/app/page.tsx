'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Flex h="100vh" align="center" justify="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="whatsapp.500" />
          <Text>Loading...</Text>
        </VStack>
      </Flex>
    );
  }

  if (!session) {
    return null;
  }

  return <ChatContainer />;
}
