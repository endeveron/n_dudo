import React from 'react';

import Fireworks from '@/core/components/shared/fireworks/fireworks';
import { Card, CardContent } from '@/core/components/ui/card';
import NewGameControls from '@/core/features/dudo/components/new-game-controls';
import { USER_NAME } from '@/core/features/dudo/constants';
import { Player } from '@/core/features/dudo/types';

interface WinnerDisplayProps {
  winner: Player | null;
  onStartNewGame: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  onStartNewGame,
}) => {
  if (!winner) return null;
  return (
    <div className="fixed inset-0 flex-center backdrop-blur-lg z-30">
      <Card>
        <CardContent className="flex-center flex-col p-8">
          <h2 className="text-4xl text-accent font-bold">
            {winner.name === USER_NAME ? (
              <Fireworks active={true} duration={10}>
                <span>You won!</span>
              </Fireworks>
            ) : (
              <span>Game over</span>
            )}
          </h2>
          <div className="my-4 text-muted">
            {winner.name === USER_NAME ? (
              <span className="text-accent">Congratulations!</span>
            ) : (
              <span className="text-muted">{winner.name} wins</span>
            )}
          </div>
          <div className="mt-4">
            <NewGameControls onStartNewGame={onStartNewGame} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WinnerDisplay;
