import { useCallback, useEffect, useState } from 'react';

import { ExtendedSession } from '@/core/features/auth/types';
import { SIGNIN_REDIRECT } from '@/core/constants';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';

// Global state to track authentication across components
const globalAuthState: {
  isSigningOut: boolean;
  lastSignOutTime: number;
} = {
  isSigningOut: false,
  lastSignOutTime: 0,
};

interface UseSessionWithRefreshReturn {
  session: ExtendedSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  refreshSession: () => Promise<Session | null>;
}

export function useSessionWithRefresh(): UseSessionWithRefreshReturn {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual refresh function for components that need it
  const refreshSession = useCallback(async () => {
    if (isRefreshing || globalAuthState.isSigningOut) return null;

    try {
      setIsRefreshing(true);
      return await update();
    } finally {
      setIsRefreshing(false);
    }
  }, [update, isRefreshing]);

  // Handle refresh token errors and sign out
  useEffect(() => {
    if (!session?.error) return;

    if (session.error === 'RefreshAccessTokenError') {
      console.log('Refresh token expired, signing out...');

      // Prevent multiple simultaneous sign-outs
      if (!globalAuthState.isSigningOut) {
        globalAuthState.isSigningOut = true;
        globalAuthState.lastSignOutTime = Date.now();

        signOut({
          callbackUrl: SIGNIN_REDIRECT,
          redirect: true,
        }).finally(() => {
          // Reset the flag after a delay to allow sign-out to complete
          setTimeout(() => {
            globalAuthState.isSigningOut = false;
          }, 1000);
        });
      }
    }
  }, [session?.error]);

  // Auto-refresh on mount if status seems stale
  useEffect(() => {
    if (isRefreshing || globalAuthState.isSigningOut) return;

    // Don't refresh if we recently signed out (within last 5 seconds)
    if (Date.now() - globalAuthState.lastSignOutTime < 5000) return;

    if (status === 'unauthenticated' && !session) {
      const timer = setTimeout(() => {
        refreshSession();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status, session, refreshSession, isRefreshing]);

  return {
    isLoading: status === 'loading' || isRefreshing,
    session: session as ExtendedSession | null,
    status,
    refreshSession,
  };
}

// /**
//  * Staleness logic (../docs/staleness-logic.md)
//  *
//  * Enable for:
//  * - Financial applications (banking, trading)
//  * - Admin dashboards with real-time permissions
//  * - Applications with short-lived tokens
//  * - Multi-tenant apps where permissions change frequently
//  *
//  * Don't enable for:
//  * - Simple content websites
//  * - Applications with long-lived sessions
//  * - High-traffic apps where API calls are expensive
//  */

// export function useSessionWithStalenessCheck() {
//   const { data: session, status, update } = useSession();
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Track when we last refreshed
//   const lastRefreshTime = useRef(Date.now());
//   const hasAttemptedRefresh = useRef(false);
//   const mountTimeRef = useRef(Date.now());

//   const refreshSession = useCallback(async () => {
//     if (isRefreshing) return;

//     try {
//       setIsRefreshing(true);
//       await update();
//       lastRefreshTime.current = Date.now();
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [update, isRefreshing]);

//   // Smart refresh logic with staleness detection
//   useEffect(() => {
//     if (isRefreshing || hasAttemptedRefresh.current) return;

//     const shouldRefresh =
//       // 1. Component just mounted and is loading (initial load)
//       (status === 'loading' && Date.now() - mountTimeRef.current < 1000) ||
//       // 2. Session exists but might be stale
//       (status === 'authenticated' &&
//         session &&
//         isSessionStale(session, lastRefreshTime.current));

//     if (shouldRefresh) {
//       console.log('Refreshing session due to staleness check');
//       hasAttemptedRefresh.current = true;
//       refreshSession();
//     }
//   }, [status, session, refreshSession, isRefreshing]);

//   // Reset refresh flag when session changes
//   useEffect(() => {
//     if (status === 'authenticated') {
//       hasAttemptedRefresh.current = false;
//     }
//   }, [status]);

//   return {
//     session: session as ExtendedSession | null,
//     status,
//     isLoading: status === 'loading' || isRefreshing,
//     refreshSession,
//     isStale: session ? isSessionStale(session, lastRefreshTime.current) : false,
//   };
// }

// // Example: User activity-based staleness
// export function useSessionWithActivityStaleness() {
//   const { data: session, status, update } = useSession();
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [lastActivity, setLastActivity] = useState(Date.now());

//   const lastRefreshTime = useRef(Date.now());
//   const hasAttemptedRefresh = useRef(false);

//   // Track user activity
//   useEffect(() => {
//     const updateActivity = () => setLastActivity(Date.now());

//     const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
//     events.forEach((event) => {
//       document.addEventListener(event, updateActivity, { passive: true });
//     });

//     return () => {
//       events.forEach((event) => {
//         document.removeEventListener(event, updateActivity);
//       });
//     };
//   }, []);

//   const isActivityStale = useCallback(() => {
//     const timeSinceActivity = Date.now() - lastActivity;
//     const timeSinceRefresh = Date.now() - lastRefreshTime.current;

//     // If user was inactive for a while and then became active,
//     // and we haven't refreshed recently, refresh the session
//     return (
//       timeSinceActivity < 5000 && // User just became active (within last 5 seconds)
//       timeSinceRefresh > STALENESS_CONFIG.INACTIVITY_THRESHOLD // Haven't refreshed in 10+ minutes
//     );
//   }, [lastActivity]);

//   const refreshSession = useCallback(async () => {
//     if (isRefreshing) return;

//     try {
//       setIsRefreshing(true);
//       await update();
//       lastRefreshTime.current = Date.now();
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [update, isRefreshing]);

//   useEffect(() => {
//     if (isRefreshing || hasAttemptedRefresh.current) return;

//     const shouldRefresh =
//       status === 'authenticated' &&
//       session &&
//       (isSessionStale(session, lastRefreshTime.current) || isActivityStale());

//     if (shouldRefresh) {
//       console.log('Refreshing session due to activity-based staleness');
//       hasAttemptedRefresh.current = true;
//       refreshSession();
//     }
//   }, [status, session, refreshSession, isRefreshing, isActivityStale]);

//   return {
//     session: session as ExtendedSession | null,
//     status,
//     isLoading: status === 'loading' || isRefreshing,
//     refreshSession,
//     lastActivity,
//   };
// }

// // Example: Critical action-based refresh
// export function useSessionForCriticalAction() {
//   const { session, refreshSession } = useSessionWithStalenessCheck();

//   const ensureFreshSession = useCallback(async () => {
//     if (!session) return false;

//     const now = Date.now();
//     const expiryTime = new Date(session.expires || 0).getTime();
//     const timeUntilExpiry = expiryTime - now;

//     // If session expires within 2 minutes, refresh it
//     if (timeUntilExpiry <= 2 * 60 * 1000) {
//       console.log('Refreshing session before critical action');
//       await refreshSession();
//       return true;
//     }

//     return false;
//   }, [session, refreshSession]);

//   return {
//     session,
//     ensureFreshSession,
//   };
// }
