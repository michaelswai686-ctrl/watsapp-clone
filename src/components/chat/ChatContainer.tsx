'use client';

import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import NewChatModal from './NewChatModal';

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender: string;
  };
}

export default function ChatContainer() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleNewChat = (phoneNumber: string) => {
    // In SWR mode, we might want to POST to create a chat, then set active
    // For now, let's just close modal. Real creation happens when sending first message or via separate API
    // Implementing simple optimistic switch for now
    onClose();
  };

  return (
    <Flex h="100vh" bg="gray.100">
      <Box w="30%" borderRight="1px" borderColor="gray.200" bg="white">
        <ChatList
          chats={[]} // ChatList handles fetching now
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onNewChat={onOpen}
        />
      </Box>
      <Box flex={1} display="flex" flexDirection="column">
        {activeChat ? (
          <ChatWindow
            chatId={activeChat}
            onSendMessage={() => { }} // Handled internally
          />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
            bg="gray.50"
          >
            <Box textAlign="center" p={8}>
              <Box fontSize="6xl" mb={4} color="gray.300">💬</Box>
              <Box fontSize="xl" color="gray.500" mb={2}>
                Select a chat to start messaging
              </Box>
              <Box color="gray.400">
                or start a new conversation
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <NewChatModal isOpen={isOpen} onClose={onClose} onSelectContact={handleNewChat} />
    </Flex>
  );
}
