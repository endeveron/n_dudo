'use server';

import { UserItem } from '@/core/features/admin/types';
import { mongoDB } from '@/core/lib/mongo';
import UserModel from '@/core/models/user';
import { ServerActionResult } from '@/core/types/common';
import { User } from '@/core/types/user';
import { handleActionError } from '@/core/utils/error';

/**
 * Retrieves user data excluding admin users from the database and returns it
 * along with a success status.
 * @returns a Promise that resolves to either a ServerActionResult object or undefined.
 */
export const getUsers = async (): Promise<
  ServerActionResult<UserItem[]> | undefined
> => {
  try {
    await mongoDB.connect();

    const userItems = await UserModel.find<User>({ role: { $ne: 'admin' } })
      .select('-_id id email emailConfirmed premium')
      .lean<UserItem[]>();

    return {
      success: true,
      data: userItems,
    };
  } catch (err: unknown) {
    return handleActionError('Unable to recieve users', err);
  }
};
