'use client';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import { Button } from '@/core/components/ui/button';
import { usePremium } from '@/core/features/premium/context';
import { PremiumStatus } from '@/core/features/premium/types';
import { cn } from '@/core/utils/common';
import DiamondIcon from '~/public/icons/ui/diamond.svg';

const Premium: React.FC = ({}) => {
  const {
    premiumStatus,
    isPremiumDialog,
    isPremiumFeatures,
    setIsPremiumDialog,
    togglePremiumFeatures,
  } = usePremium();

  return (
    <>
      {premiumStatus === PremiumStatus.inactive && !isPremiumDialog && (
        <AnimatedAppear>
          <Button
            size="sm"
            onClick={() => setIsPremiumDialog(true)}
            variant="accent"
          >
            Get Premium Bet Tips
          </Button>
        </AnimatedAppear>
      )}

      {premiumStatus === PremiumStatus.active && (
        <AnimatedAppear
          onClick={togglePremiumFeatures}
          className={cn(
            'premium_toggle h-6 w-6 transition-colors cursor-pointer',
            isPremiumFeatures
              ? 'text-title'
              : 'text-white/40 dark:text-white/30'
          )}
          title="Premium betting tips"
        >
          <DiamondIcon />
        </AnimatedAppear>
      )}
    </>
  );
};

export default Premium;
