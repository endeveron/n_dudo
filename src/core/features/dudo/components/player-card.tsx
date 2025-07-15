import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
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
  // isYou,
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
    <Card
      className={cn(
        'h-20 w-28 relative flex-center flex-col rounded-md',
        !player.isActive && 'opacity-20',
        isCurrentPlayer && 'ring-4',
        result === 0 && 'ring-negative',
        result === 1 && 'ring-positive',
        result === undefined && 'ring-positive'
      )}
    >
      <CardHeader className="px-4 py-1">
        <CardTitle className="py-2 text-center truncate">
          <div className="-translate-x-0.5">{player.name}</div>
        </CardTitle>
      </CardHeader>

      {player.diceCount ? (
        <CardContent className="px-4 py-1">
          <div className="text-center -mt-2 mb-2">
            <span className="font-bold">{player.diceCount}</span>
            <span className="text-xs text-muted ml-1">dice</span>
          </div>
        </CardContent>
      ) : null}

      {isRolling && (
        <div className="absolute flex gap-1 p-2 left-1/2 -top-12 -translate-x-1/2">
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
    </Card>
  );
};

export default PlayerCard;
