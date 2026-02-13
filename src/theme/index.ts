import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Extend the theme
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    whatsapp: {
      primary: '#25D366',
      secondary: '#128C7E',
      light: '#DCF8C6',
      dark: '#075E54',
      blue: '#34B7F1',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'dark' ? 'whatsapp.primary' : 'whatsapp.primary',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whatsapp.dark' : 'whatsapp.secondary',
            _disabled: {
              bg: props.colorMode === 'dark' ? 'whatsapp.primary' : 'whatsapp.primary',
            },
          },
        }),
        outline: {
          borderColor: 'whatsapp.primary',
          color: 'whatsapp.primary',
          _hover: {
            bg: 'rgba(37, 211, 102, 0.1)',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100',
            _hover: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'white',
              borderColor: 'whatsapp.primary',
            },
          },
        }),
      },
    },
  },
});

export default theme;
