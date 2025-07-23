import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from '@/core/types/user';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      role: UserRole;
      premium: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
    premium: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    premium: string | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
