import { User } from '@/core/types/user';

export type UserItem = Pick<
  User,
  'id' | 'email' | 'emailConfirmed' | 'premium'
> & {
  selected?: boolean;
};
