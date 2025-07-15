import React from 'react';

import { Card, CardContent } from '@/core/components/ui/card';
import Dice from '@/core/features/dudo/components/dice';
import { GameHistoryEntry, Player } from '@/core/features/dudo/types';
import { HISTORY_LENGTH } from '@/core/features/dudo/constants';

interface HistoryDisplayProps {
  gameHistory: GameHistoryEntry[];
  players: Player[];
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({
  gameHistory,
  players,
}) => {
  return gameHistory.length > 0 ? (
    <Card className="w-36 bg-card/30">
      <CardContent className="relative pt-6 pb-0 pl-8 space-y-3">
        {gameHistory
          .slice(HISTORY_LENGTH * -1)
          .reverse()
          .map((entry, index) => {
            const fadeStartIndex = 4;
            const fadeRange = HISTORY_LENGTH - fadeStartIndex;
            const opacity =
              index >= fadeStartIndex
                ? 1 - ((index - fadeStartIndex + 1) / fadeRange) * 0.9
                : 1;
            return (
              <div
                key={index}
                className="text-sm font-bold transition-opacity"
                style={{ opacity }}
              >
                {entry.action === 'bet' ? (
                  <div className="flex gap-2">
                    <div className="text-accent">
                      {players[entry.player]?.name}
                    </div>
                    <div className="flex items-center">
                      <div>{entry.bet.count}</div>
                      <div className="mx-1">×</div>
                      <Dice
                        value={entry.bet.value}
                        size="sm"
                        className="opacity-85 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-accent tracking-wide">
                    {entry.result.betWasCorrect ? (
                      // <span className="text-negative-text">
                      <span>{players[entry.player]?.name} lost</span>
                    ) : (
                      // <span className="text-positive-text">
                      <span>{players[entry.player]?.name} won</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        <div className="absolute left-4 top-[30px] w-2 h-2 rounded-full bg-white opacity-40 dark:opacity-20" />
      </CardContent>
    </Card>
  ) : (
    <div className="w-36 h-full rounded-xl bg-card/30"></div>
  );
};

export default HistoryDisplay;
