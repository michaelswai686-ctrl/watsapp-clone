# WhatsApp Clone

A full-stack WhatsApp clone built with Next.js, TypeScript, and Chakra UI.

## Features

- Phone number authentication with OTP verification
- Real-time messaging using Socket.IO
- 1-on-1 chat functionality
- User search by phone number
- Responsive design with WhatsApp-like UI
- Message status indicators (sent, delivered, read)
- Online/offline status

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Chakra UI
- Tailwind CSS
- Socket.IO Client
- NextAuth.js

### Backend
- Node.js with Next.js API Routes
- MongoDB Atlas
- Socket.IO
- Twilio (for SMS OTP)
- JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and fill in your MongoDB URI and other secrets

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Demo OTP

For demo purposes, the OTP is always `123456`. In production, you would integrate with Twilio to send actual SMS messages.

## Deployment

This app is configured to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

## Free Tier Services Used

- **Vercel**: Hosting and serverless functions
- **MongoDB Atlas**: Database (512MB free tier)
- **Twilio**: SMS service (free trial with $15 credit)
- **Socket.IO**: Real-time communication (via Vercel serverless functions)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
