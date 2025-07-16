import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from './your-user-types'; // Import your UserRole enum

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      role: UserRole;
      sub?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    sub?: string;
    error?: string;
  }
}
