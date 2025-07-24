'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { PremiumStatus } from '@/core/features/premium/types';
import { useLocalStorage } from '@/core/hooks/use-local-storage';
import { useSessionWithRefresh } from '@/core/features/auth/hooks/use-session-with-refresh';
import { getPremiumStatus } from '@/core/features/premium/actions';

const PREMIUM_KEY = 'premium';

interface PremiumContextType {
  premiumStatus: PremiumStatus | null;
  checkPremiumStatus: () => Promise<PremiumStatus | null>;
  isPremiumDialog: boolean;
  setIsPremiumDialog: Dispatch<SetStateAction<boolean>>;
  isPremiumFeatures: boolean;
  processPremium: () => void;
  togglePremiumFeatures: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { session, status } = useSessionWithRefresh();
  const [getPremiumStatusFromStorage, savePremiumStatusInStorage] =
    useLocalStorage();

  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(
    null
  );
  const [isPremiumDialog, setIsPremiumDialog] = useState(false);
  const [isPremiumFeatures, setIsPremiumFeatures] = useState(false);

  const statusCheckedRef = useRef(false);

  const email = session?.user.email;
  const isPremiumFromSession = !!session?.user.isPremium;

  const togglePremiumFeatures = () => {
    setIsPremiumFeatures((prev) => !prev);
  };

  const updateStatus = useCallback(
    (newStatus: PremiumStatus) => {
      savePremiumStatusInStorage<PremiumStatus>(PREMIUM_KEY, newStatus);
      setPremiumStatus(newStatus);
      statusCheckedRef.current = true;
      return newStatus;
    },
    [savePremiumStatusInStorage]
  );

  const processPremium = () => {
    updateStatus(PremiumStatus.processing);
  };

  const checkPremiumStatus = useCallback(async () => {
    if (!email) return null;

    if (statusCheckedRef.current) {
      return premiumStatus;
    }

    const statusFromStorage =
      getPremiumStatusFromStorage<PremiumStatus>(PREMIUM_KEY);

    // Handle processing case
    if (statusFromStorage === PremiumStatus.processing) {
      // console.log('[premium] checkPremiumStatus: Recieving status from db');
      try {
        const statusRes = await getPremiumStatus({ email: email as string });

        if (!statusRes?.success) {
          console.error(
            '[premium] checkPremiumStatus: Unable to verify status in db'
          );
          return null;
        }

        if (statusRes.data) {
          // console.log(
          //   '[premium] checkPremiumStatus: Premium has been confirmed. Update status to `active'
          // );
          return updateStatus(PremiumStatus.active);
        } else {
          // console.log(
          //   '[premium] checkPremiumStatus: Premium has not been confirmed yet'
          // );
        }

        return null;
      } catch (err: unknown) {
        console.error(err);
        return null;
      }
    }

    // Priority 1: Recieve status from the auth session
    if (isPremiumFromSession) {
      // console.log(
      //   '[premium] checkPremiumStatus: Status recieved from the auth session'
      // );
      // Update LocalStorage item
      if (!statusFromStorage) {
        savePremiumStatusInStorage<PremiumStatus>(
          PREMIUM_KEY,
          PremiumStatus.active
        );
      }

      // Update local state
      if (premiumStatus !== PremiumStatus.active) {
        setPremiumStatus(PremiumStatus.active);
      }

      statusCheckedRef.current = true;
      return PremiumStatus.active;
    }

    // Priority 2: If status in LocalStorage is `active`, should be checked on server
    if (statusFromStorage === PremiumStatus.active) {
      // console.log(
      //   '[premium] checkPremiumStatus: Recieved `active` from LocalStorage. Checking on the server...'
      // );
      // Check status on server, update in LS if false
      try {
        const statusRes = await getPremiumStatus({ email });

        if (!statusRes?.success || !statusRes.data) {
          // console.log(
          //   '[premium] checkPremiumStatus: Status `active` has not been confirmed. Update status to `inactive`'
          // );
          return updateStatus(PremiumStatus.inactive);
        }

        // console.log(
        //   '[premium] checkPremiumStatus: Status `active` has been confirmed'
        // );
        if (statusRes.data && premiumStatus !== PremiumStatus.active) {
          return updateStatus(PremiumStatus.active);
        }
      } catch (err: unknown) {
        console.error(err);
        return null;
      }
    }

    // Otherwise set status as `inactive`
    return updateStatus(PremiumStatus.inactive);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    // Only act when we have a definitive authenticated status
    if (status === 'authenticated' && email) {
      checkPremiumStatus();
    }
  }, [status, email, checkPremiumStatus]);

  return (
    <PremiumContext.Provider
      value={{
        premiumStatus,
        isPremiumDialog,
        isPremiumFeatures,
        checkPremiumStatus,
        setIsPremiumDialog,
        processPremium,
        togglePremiumFeatures,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context)
    throw new Error('usePremium must be used within PremiumProvider');
  return context;
}
