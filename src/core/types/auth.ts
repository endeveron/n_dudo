import { UserRole } from '@/core/types/user';

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }
  // interface Session { user: User }
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

// export type Token = {
//   _id: ObjectId;
//   email: string;
//   token: string;
//   id?: string;
//   expiresAt?: number;
// };

// export type TAccount = {
//   _id: ObjectId;
//   userId: string;
//   type: string;
//   provider: string;
//   id?: string;
//   providerAccountId: string;
//   refreshToken?: string;
//   accessToken?: string;
//   expiresAt?: Date;
//   tokenType?: string;
//   scope?: string;
//   idToken?: string;
//   sessionState?: string;
// };
