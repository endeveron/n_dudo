import { NextAuthConfig } from 'next-auth';

export default {
  jwt: {
    maxAge: 5 * 24 * 60 * 60, // 5 days in seconds
  },
  session: {
    strategy: 'jwt', // Required for refresh token logic
    maxAge: 5 * 24 * 60 * 60, // 5 days in seconds
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
  providers: [],
} satisfies NextAuthConfig;
