'use client';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import NewGameControls from '@/core/features/dudo/components/new-game-controls';
import { Player } from '@/core/features/dudo/types';

interface StartNewGameProps {
  players: Player[];
  onGameStart: () => void;
}

const StartNewGame = ({ players, onGameStart }: StartNewGameProps) => {
  if (players.length !== 0) return null;

  return (
    <AnimatedAppear>
      <Card className="p-4 space-y-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold">
            New game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewGameControls onStartNewGame={onGameStart} />
        </CardContent>
      </Card>
    </AnimatedAppear>
  );
};

export default StartNewGame;
