import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { UserRole } from '@/core/types/user';

export interface CustomToken extends JWT {
  sub?: string;
  role: UserRole;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

// Extended session type with custom properties
export interface ExtendedSession extends Session {
  accessToken?: string;
  error?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  };
}

export enum SocialProvider {
  google = 'google',
}

export type Credentials = {
  email: string;
  password: string;
};

export type SignInArgs = Credentials & {
  redirectTo?: string;
};

export type SignInSocialArgs = {
  provider: SocialProvider;
  email: string;
  emailConfirmed: boolean;
  name: string | null | undefined;
  image: string | null | undefined;
};

export type SignUpArgs = {
  email: string;
};

export type OnboardUserArgs = {
  userId: string;
  name?: string;
  password: string;
};

export type CreateUserArgs = {
  email: string;
};
