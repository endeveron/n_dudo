import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExtendedSession } from '@/core/types/auth';

interface UseSessionWithRefreshReturn {
  session: ExtendedSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
}

export function useSessionWithRefresh(): UseSessionWithRefreshReturn {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Handle refresh token errors
    if (session?.error === 'RefreshAccessTokenError') {
      console.log('Refresh token expired, signing out...');
      signOut({
        callbackUrl: '/signin',
        redirect: true,
      });
    }
  }, [session, router]);

  useEffect(() => {
    // Force session update after component mounts
    if (status === 'unauthenticated') {
      update(); // This forces useSession to refetch
    }
  }, [status, update]);

  return {
    session: session as ExtendedSession | null,
    status,
    isLoading: status === 'loading',
  };
}
