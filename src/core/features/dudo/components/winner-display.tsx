import React, { useEffect, useState } from 'react';

import {
  AnimatedCard,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/core/components/shared/card';
import Fireworks from '@/core/components/shared/firework/firework';
import NewGameControls from '@/core/features/dudo/components/new-game-controls';
import { USER_NAME } from '@/core/features/dudo/constants';
import { GameMode, Player } from '@/core/features/dudo/types';

interface WinnerDisplayProps {
  winner: Player | null;
  onStartNewGame: (gameMode: GameMode) => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  onStartNewGame,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const isAllowed = !!winner;

  const startNewGame = (gameMode: GameMode) => {
    setIsOpen(false);
    if (onStartNewGame) onStartNewGame(gameMode);
  };

  useEffect(() => {
    if (isAllowed && !isOpen) setIsOpen(true);
  }, [isAllowed, isOpen]);

  if (!isAllowed) return null;

  return (
    <AnimatedCard isOpen={isOpen}>
      <CardTitle>
        {winner.name === USER_NAME ? (
          <Fireworks active={true} duration={10}>
            <span>You won!</span>
          </Fireworks>
        ) : (
          <span>Game over</span>
        )}
      </CardTitle>
      <CardDescription className="text-muted">
        {winner.name === USER_NAME ? (
          <span className="text-accent">Congratulations!</span>
        ) : (
          <span className="text-muted">{winner.name} wins</span>
        )}
      </CardDescription>
      <CardContent>
        <NewGameControls onStartNewGame={startNewGame} />
      </CardContent>
    </AnimatedCard>
  );
};

export default WinnerDisplay;
