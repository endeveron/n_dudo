import React, { useMemo } from 'react';

import Dice from '@/core/features/dudo/components/dice';
import { Bet, GamePhase } from '@/core/features/dudo/types';
import { cn } from '@/core/utils/common';

interface BettingDisplayProps {
  gamePhase: GamePhase;
  recentAction: string | null;
  currentBet: Bet | null;
  recentChallengeResult?: {
    actualCount: number;
    betWasCorrect: boolean;
  } | null;
  className?: string;
}

const BettingDisplay: React.FC<BettingDisplayProps> = ({
  gamePhase,
  recentAction,
  currentBet,
  recentChallengeResult,
  className,
}) => {
  const hasRecentAction = Boolean(recentAction);
  const isRollingPhase = gamePhase === 'rolling';
  const isBettingPhase = gamePhase === 'betting';

  // Memoized recent action content
  const recentActionContent = useMemo(() => {
    if (!hasRecentAction) return null;

    if (isBettingPhase && currentBet) {
      return (
        <div className="text-xl text-accent font-bold leading-none">
          {recentAction}
        </div>
      );
    }

    if (isRollingPhase) {
      const actionElement = (
        <div className="text-xl text-accent font-bold leading-none">
          {recentAction}
        </div>
      );

      if (recentChallengeResult?.actualCount) {
        const resultMessage = recentChallengeResult.betWasCorrect
          ? `${recentChallengeResult.actualCount} correct dice were in play`
          : `Only ${recentChallengeResult.actualCount} dice were in play`;

        return (
          <div className="flex-center flex-col gap-3">
            {actionElement}
            <div className="text-sm text-muted leading-none">
              {resultMessage}
            </div>
          </div>
        );
      }

      return (
        <div className="flex-center flex-col gap-3">
          {actionElement}
          <div className="text-sm text-muted leading-none">
            Too few correct dice
          </div>
        </div>
      );
    }

    return null;
  }, [
    hasRecentAction,
    isBettingPhase,
    currentBet,
    isRollingPhase,
    recentAction,
    recentChallengeResult?.actualCount,
    recentChallengeResult?.betWasCorrect,
  ]);

  // Memoized placeholder content
  const placeholderContent = useMemo(() => {
    if (!currentBet && (!hasRecentAction || isBettingPhase)) {
      return <div className="text-sm text-system">No bet yet</div>;
    }
    return null;
  }, [currentBet, hasRecentAction, isBettingPhase]);

  // Memoized current bet content
  const currentBetContent = useMemo(() => {
    if (!currentBet) return null;

    return (
      <div className="flex-center gap-3 font-bold">
        <div className="text-4xl leading-none">{currentBet.count}</div>
        <div className="text-2xl">×</div>
        <Dice value={currentBet.value} />
      </div>
    );
  }, [currentBet]);

  return (
    <div className={cn('flex-center flex-col gap-3', className)}>
      {recentActionContent}
      {placeholderContent}
      {currentBetContent}
    </div>
  );
};

export default BettingDisplay;
