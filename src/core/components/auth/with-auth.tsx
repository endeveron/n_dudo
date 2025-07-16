// Higher-order component for protected routes
import { useSessionWithRefresh } from '@/core/hooks/use-session-with-refresh';
import { signOut } from 'next-auth/react';
import { ComponentType } from 'react';

interface WithAuthProps {
  // Add any props your component needs
  prop: unknown;
}

export function withAuth<T extends WithAuthProps>(
  Component: ComponentType<T>
): ComponentType<T> {
  return function AuthenticatedComponent(props: T) {
    const { status } = useSessionWithRefresh();

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
      return (
        <div>
          <p>Access denied. Please sign in.</p>
          <button onClick={() => signOut({ callbackUrl: '/signin' })}>
            Sign In
          </button>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
