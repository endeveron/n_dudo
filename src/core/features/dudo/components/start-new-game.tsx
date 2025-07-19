'use client';

import { useEffect, useState } from 'react';

import {
  AnimatedCard,
  CardContent,
  CardTitle,
} from '@/core/components/shared/card';
import NewGameControls from '@/core/features/dudo/components/new-game-controls';
import { GameMode, Player } from '@/core/features/dudo/types';

interface StartNewGameProps {
  players: Player[];
  onStartNewGame: (gameMode: GameMode) => void;
}

const StartNewGame: React.FC<StartNewGameProps> = ({
  players,
  onStartNewGame,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const isAllowed = players.length === 0;

  const handleStartNewGame = (gameMode: GameMode) => {
    setIsOpen(false);
    if (onStartNewGame) onStartNewGame(gameMode);
  };

  useEffect(() => {
    if (isAllowed && !isOpen) setIsOpen(true);
  }, [isAllowed, isOpen]);

  if (!isAllowed) return null;

  return (
    <AnimatedCard isOpen={isOpen}>
      <CardTitle>New game</CardTitle>
      <CardContent>
        <NewGameControls onStartNewGame={handleStartNewGame} />
      </CardContent>
    </AnimatedCard>
  );
};

export default StartNewGame;
