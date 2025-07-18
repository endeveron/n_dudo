import React from 'react';

import Fireworks from '@/core/components/shared/firework/firework';
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
    <div className="fixed inset-0 flex-center z-30">
      <div className="flex-center flex-col px-4 py-8 sm:px-8 bg-card border-card-border border-1 rounded-xl cursor-default">
        <h3 className="text-4xl text-title font-extrabold">
          {winner.name === USER_NAME ? (
            <Fireworks active={true} duration={10}>
              <span>You won!</span>
            </Fireworks>
          ) : (
            <span>Game over</span>
          )}
        </h3>
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
      </div>
    </div>
  );
};

export default WinnerDisplay;
