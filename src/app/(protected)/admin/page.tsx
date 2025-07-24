import { redirect } from 'next/navigation';

import AdminDashboardClient from '@/core/features/admin/components/dashboard';
import { auth } from '~/auth';
import { DEFAULT_REDIRECT } from '@/core/routes';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (session?.user.role !== 'admin') return redirect(DEFAULT_REDIRECT);

  return <AdminDashboardClient />;
}
