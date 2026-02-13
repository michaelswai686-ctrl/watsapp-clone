import { Inter } from 'next/font/google';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Providers } from './providers';
import theme from '@/theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WhatsApp Clone',
  description: 'A WhatsApp clone built with Next.js and Chakra UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Providers>
            {children}
          </Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}
