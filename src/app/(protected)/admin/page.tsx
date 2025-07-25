import { redirect } from 'next/navigation';

import { BASE_URL, DEFAULT_REDIRECT, SIGNIN_REDIRECT } from '@/core/constants';
import AdminDashboardClient from '@/core/features/admin/components/dashboard';
import { SearchParams } from '@/core/types/common';
import { auth } from '~/auth';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { e, t } = await searchParams;
  const email = e as string;
  const transactionId = t as string;

  const session = await auth();

  if (session?.user && session?.user.role !== 'admin') {
    return redirect(DEFAULT_REDIRECT);
  }

  if (email && transactionId && !session?.user) {
    const signInUrl = new URL(SIGNIN_REDIRECT, BASE_URL);
    const redirectTo = `admin?e=${email}&t=${transactionId}`;
    signInUrl.searchParams.set('redirectTo', redirectTo);
    return redirect(signInUrl.toString());
  }

  if (!session?.user) {
    const signInUrl = new URL(SIGNIN_REDIRECT, BASE_URL);
    signInUrl.searchParams.set('redirectTo', 'admin');
    return redirect(signInUrl.toString());
  }

  return <AdminDashboardClient />;
}
