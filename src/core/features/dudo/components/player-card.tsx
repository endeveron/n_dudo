import React from 'react';

import Dice from '@/core/features/dudo/components/dice';
import { Player, RecentHistoryResult } from '@/core/features/dudo/types';
import { cn } from '@/core/utils/common';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isYou: boolean;
  inputValue: number;
  isRolling: boolean;
  recentHistoryResult?: RecentHistoryResult;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer,
  inputValue,
  isRolling,
  recentHistoryResult,
}) => {
  let result;
  if (isCurrentPlayer) {
    if (
      (player.id === recentHistoryResult?.challenger &&
        recentHistoryResult.betWasCorrect) ||
      (player.id === recentHistoryResult?.bettor &&
        !recentHistoryResult.betWasCorrect)
    ) {
      result = 0;
    }

    if (
      (player.id === recentHistoryResult?.bettor &&
        recentHistoryResult.betWasCorrect) ||
      (player.id === recentHistoryResult?.challenger &&
        !recentHistoryResult.betWasCorrect)
    ) {
      result = 1;
    }
  }

  return (
    <div
      className={cn(
        'player-card',
        !player.isActive && 'opacity-20',
        isCurrentPlayer && 'ring-4',
        result === 0 && 'ring-danger',
        result === 1 && 'ring-white/90 dark:ring-accent/80',
        result === undefined && 'ring-white/90 dark:ring-accent/80'
      )}
    >
      <div className="text-xl text-title font-bold leading-none">
        {player.name}
      </div>

      {player.isActive && (
        <div className="mt-2 h-4 flex-center">
          {isRolling && (
            <div className="flex-center gap-1">
              {player.dice.map((value: number, index: number) => (
                <Dice
                  className={cn(
                    'text-white transition-opacity',
                    value !== inputValue && value !== 1 && 'opacity-20'
                  )}
                  value={value}
                  key={index}
                  size="sm"
                />
              ))}
            </div>
          )}

          {!isRolling && player.diceCount ? (
            <div className={cn('pb-1 text-center', isRolling && 'opacity-0')}>
              <span className="font-bold">{player.diceCount}</span>
              <span className="text-xs text-muted ml-1">dice</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
