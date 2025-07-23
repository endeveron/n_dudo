'use server';

import { ProcessTransactionIdArgs } from '@/core/features/premium/types';
import { CheckPremiumStatusArgs } from '@/core/features/premium/types';
import { mongoDB } from '@/core/lib/mongo';
import { configureTransactionEmail, sendEmail } from '@/core/lib/nodemailer';
import UserModel from '@/core/models/user';
import { ServerActionResult } from '@/core/types/common';
import { User } from '@/core/types/user';
import { handleActionError } from '@/core/utils/error';

/**
 * Checks the premium status by the user's email.
 * @param {string} params.email email address of the user.
 * @returns a Promise that resolves to either a ServerActionResult object or undefined.
 */
export const getPremiumStatus = async ({
  email,
}: CheckPremiumStatusArgs): Promise<
  ServerActionResult<boolean> | undefined
> => {
  if (!email) {
    return handleActionError('checkPremiumStatus: Invalid email');
  }

  try {
    await mongoDB.connect();

    const user = await UserModel.findOne<User>({ email });

    if (!user) {
      return handleActionError(
        'The user with the specified email does not exist'
      );
    }

    return {
      success: true,
      data: !!user.premium?.transactionId,
    };
  } catch (err: unknown) {
    return handleActionError('Unable to verify the status of premium', err);
  }
};

/**
 * Sends an email with the transaction id and user email to BILLING_ACC.
 * @param {string} params.email email address of the user.
 * @param {string} params.transactionId transaction id.
 * @returns a Promise that resolves to either a ServerActionResult object or undefined.
 */
export const processTransactionId = async ({
  email,
  transactionId,
}: ProcessTransactionIdArgs): Promise<ServerActionResult | undefined> => {
  if (!email || !transactionId) {
    return handleActionError(
      'processTransactionId: Invalid arguments provided'
    );
  }

  try {
    await mongoDB.connect();

    const user = await UserModel.findOne<User>({ email });

    if (!user) {
      return handleActionError(
        'The user with the specified email does not exist'
      );
    }

    // Configure mail data
    const data = configureTransactionEmail({
      email,
      transactionId,
    });

    // Send the email
    const messageSent = await sendEmail(data);
    if (!messageSent) {
      handleActionError('An email transporter error occured', null, true);
    }

    return {
      success: true,
      // data: { userId: userData.id },
    };
  } catch (err: unknown) {
    return handleActionError('Unable to create a new user', err);
  }
};
