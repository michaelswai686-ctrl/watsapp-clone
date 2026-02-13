'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (phoneNumber: string) => void;
}

export default function NewChatModal({ isOpen, onClose, onSelectContact }: NewChatModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would search for the user in your database
      // For demo, we'll just assume the user exists
      onSelectContact(phoneNumber);
      setPhoneNumber('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'User not found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start New Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="whatsapp" 
            onClick={handleSearch}
            isLoading={isLoading}
            loadingText="Searching..."
          >
            Start Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
