import { redirect } from 'next/navigation';

import DudoClient from '@/core/features/dudo/components/dudo';
import { SIGNIN_REDIRECT } from '@/core/constants';
import { auth } from '~/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dudo',
  description: "Liar's Dice game",
};

export default async function DudoPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect(SIGNIN_REDIRECT);
  }

  return <DudoClient />;
}
