'use client';

import {
  Box,
  VStack,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender: string;
  };
}

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatList({ chats, activeChat, onSelectChat, onNewChat }: ChatListProps) {
  const { data: session } = useSession();
  // ... rest of code
  const { data: fetchedChats } = useSWR('/api/chats', fetcher, { refreshInterval: 2000 });
  const displayChats = fetchedChats || chats;

  const getOtherParticipant = (participants: string[]) => {
    return participants.find(p => p !== session?.user?.phoneNumber) || 'Unknown';
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <Text fontSize="xl" fontWeight="bold" mb={4}>Chats</Text>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search messages"
            bg="gray.50"
            border="none"
            _focus={{ bg: 'white', shadow: 'sm' }}
          />
        </InputGroup>
      </Box>

      <Box
        p={2}
        borderBottom="1px"
        borderColor="gray.200"
        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
        onClick={onNewChat}
      >
        <Box display="flex" alignItems="center" p={2} borderRadius="md">
          <Box
            w={10}
            h={10}
            borderRadius="full"
            bg="whatsapp.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={3}
          >
            <Icon as={FiUserPlus} color="whatsapp.600" />
          </Box>
          <Text fontWeight="medium">New Chat</Text>
        </Box>
      </Box>

      <Box flex={1} overflowY="auto">
        <VStack spacing={0} divider={<Divider />}>
          {displayChats.map((chat: Chat) => {
            const otherParticipant = getOtherParticipant(chat.participants);
            const isActive = chat.id === activeChat;

            return (
              <Box
                key={chat.id}
                p={3}
                bg={isActive ? 'gray.100' : 'transparent'}
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => onSelectChat(chat.id)}
                borderLeft={isActive ? '4px solid' : 'none'}
                borderLeftColor="whatsapp.500"
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    name={otherParticipant}
                    size="md"
                    mr={3}
                    bg="whatsapp.500"
                    color="white"
                  />
                  <Box flex={1} minW={0}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Text
                        fontWeight="medium"
                        isTruncated
                        color={isActive ? 'whatsapp.600' : 'gray.800'}
                      >
                        {otherParticipant}
                      </Text>
                      {chat.lastMessage && (
                        <Text fontSize="xs" color="gray.500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </Text>
                      )}
                    </Box>
                    {chat.lastMessage && (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        isTruncated
                        display="flex"
                        alignItems="center"
                      >
                        {chat.lastMessage.sender === session?.user?.phoneNumber ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
}
