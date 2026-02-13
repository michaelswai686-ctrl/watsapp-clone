'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { SocketProvider } from '@/contexts/SocketContext';
import { AuthProvider } from '@/contexts/AuthContext';
import theme from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              shouldRetryOnError: false,
            }}
          >
            <AuthProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </AuthProvider>
          </SWRConfig>
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
