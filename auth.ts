import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import Google from 'next-auth/providers/google';

import {
  authorizeUser,
  refreshAccessToken,
  signInSocial,
} from '@/core/actions/auth';
import authConfig from '@/core/config/auth';
import { signInSchema } from '@/core/schemas/auth';
import { UserRole } from '@/core/types/user';
import { CustomToken, SocialProvider } from '@/core/types/auth';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ account, profile }) {
      // Handle authentication using Google provider
      if (account && profile && account.provider === 'google') {
        // Check user email
        if (
          !profile.email ||
          !profile.email_verified ||
          !profile.email?.endsWith('@gmail.com')
        ) {
          return false;
        }
        // Add user to the database if it has not been created
        const { email, email_verified, name, picture } = profile;
        const res = await signInSocial({
          provider: SocialProvider.google,
          email,
          emailConfirmed: email_verified,
          name: name,
          image: picture,
        });
        if (!res?.success) return false;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      const customToken = token as CustomToken;

      // Initial sign in
      if (account && user) {
        return {
          ...customToken,
          role: user?.role || UserRole.user,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + 24 * 60 * 60 * 1000, // 24 hours default
        };
      }

      // Add user role if not present
      if (user && !customToken.role) {
        customToken.role = user?.role || UserRole.user;
      }

      // Return previous token if the access token has not expired yet
      if (
        customToken.accessTokenExpires &&
        Date.now() < customToken.accessTokenExpires
      ) {
        return customToken;
      }

      // Access token has expired, try to update it
      console.log('Access token expired, attempting to refresh...');
      return await refreshAccessToken(customToken);
    },

    async session({ session, token }) {
      const customToken = token as CustomToken;

      // Persist the user objectId
      if (session.user && customToken?.sub) {
        session.user.id = customToken.sub;
      }

      // Persist the user role
      // https://authjs.dev/guides/basics/role-based-access-control#with-jwt
      if (session.user && customToken.role) {
        session.user.role = customToken.role as UserRole;
      }

      // Add access token to session for API calls
      if (customToken?.accessToken) {
        session.accessToken = customToken.accessToken;
      }

      // Handle token refresh errors
      if (customToken?.error === 'RefreshAccessTokenError') {
        // Force sign out if refresh fails
        session.error = 'RefreshAccessTokenError';
      }

      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const result: User | null = await authorizeUser({ email, password });
          return result;
        }
        console.error('Invalid credentials');
        return null;
      },
    }),
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
});
