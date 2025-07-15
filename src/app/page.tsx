import { redirect } from 'next/navigation';

import WelcomeClient from '@/core/components/welcome';
import { SearchParams } from '@/core/types/common';
import { auth } from '~/auth';
import { DEFAULT_REDIRECT } from '@/core/routes';

export default async function Welcome({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { r } = await searchParams;
  const referrerCode = r as string;
  const session = await auth();

  if (session?.user?.email) {
    return redirect(
      `${DEFAULT_REDIRECT}${referrerCode ? `?r=${referrerCode}` : ''}`
    );
  }

  return <WelcomeClient />;
}
