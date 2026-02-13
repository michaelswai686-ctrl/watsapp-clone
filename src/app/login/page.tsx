'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Box, Button, Container, FormControl, FormLabel, Input, VStack, Heading, Text, useToast } from '@chakra-ui/react';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setShowOtpField(true);
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        phoneNumber,
        otp,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Welcome to WhatsApp Clone
          </Heading>
          <Text color="gray.600">Sign in to continue</Text>
        </Box>

        {!showOtpField ? (
          <Box as="form" onSubmit={handleSendOtp}>
            <VStack spacing={4}>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="whatsapp"
                width="100%"
                isLoading={isLoading}
                loadingText="Sending OTP..."
              >
                Send OTP
              </Button>
            </VStack>
          </Box>
        ) : (
          <Box as="form" onSubmit={handleVerifyOtp}>
            <VStack spacing={4}>
              <FormControl id="otp" isRequired>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="whatsapp"
                width="100%"
                isLoading={isLoading}
                loadingText="Verifying..."
              >
                Verify OTP
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
