import { signOut, useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SIGNIN_REDIRECT } from '@/core/constants';
import { authStateManager } from '@/core/features/auth/state';
import { ExtendedSession } from '@/core/features/auth/types';

interface UseSessionWithRefreshReturn {
  session: ExtendedSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  refreshSession: () => Promise<ExtendedSession | null>;
  signOutSafely: () => Promise<void>;
}

export function useSessionWithRefresh(): UseSessionWithRefreshReturn {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const signOutInProgress = useRef(false);

  // Track session changes to update global state
  useEffect(() => {
    if (session?.user) {
      authStateManager.setSessionId(session.user.id || 'anonymous');
    }
  }, [session?.user]);

  // Safe refresh function that respects logout state
  const refreshSession = useCallback(async () => {
    if (authStateManager.shouldPreventSessionCalls() || isRefreshing) {
      return null;
    }

    try {
      setIsRefreshing(true);
      const updatedSession = await update();
      return updatedSession as ExtendedSession | null;
    } catch (error) {
      console.warn('Session refresh failed:', error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [update, isRefreshing]);

  // Safe sign out function with multiple simultaneous sign-out prevention
  const signOutSafely = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous sign-outs using both ref and global state
    if (signOutInProgress.current || !authStateManager.canSignOut()) {
      // console.log('Sign out already in progress, skipping...');
      return;
    }

    try {
      signOutInProgress.current = true;
      authStateManager.setSigningOut(true);

      // console.log('Starting sign out process...');

      // Clear any pending refresh timers
      setIsRefreshing(false);

      await signOut({
        callbackUrl: SIGNIN_REDIRECT,
        redirect: true,
      });

      authStateManager.setSignedOut(true);
      // console.log('Sign out completed');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Reset the ref immediately
      signOutInProgress.current = false;
      // Reset global state with delay to allow cleanup
      setTimeout(() => {
        authStateManager.setSigningOut(false);
      }, 1500);
    }
  }, []);

  // Handle refresh token errors and automatic sign out with simultaneous prevention
  useEffect(() => {
    if (!session?.error || signOutInProgress.current) return;

    if (session.error === 'RefreshAccessTokenError') {
      // console.log('Refresh token expired, signing out...');

      // Prevent multiple simultaneous sign-outs from refresh token errors
      if (authStateManager.canSignOut()) {
        signOutSafely();
      } else {
        // console.log(
        //   'Sign out already in progress due to refresh token error, skipping...'
        // );
      }
    }
  }, [session?.error, signOutSafely]);

  // Conditional auto-refresh logic
  useEffect(() => {
    if (authStateManager.shouldPreventSessionCalls() || isRefreshing) {
      return;
    }

    // Only attempt refresh if we have a valid state for it
    if (
      status === 'unauthenticated' &&
      !session &&
      !authStateManager.getState().isSignedOut
    ) {
      const timer = setTimeout(() => {
        refreshSession();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, session, refreshSession, isRefreshing]);

  // Reset state on successful authentication
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      authStateManager.setSignedOut(false);
    }
  }, [status, session?.user]);

  return {
    session: session as ExtendedSession | null,
    status,
    isLoading: status === 'loading' || isRefreshing,
    refreshSession,
    signOutSafely,
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
