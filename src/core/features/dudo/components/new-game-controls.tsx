'use client';

import { Button } from '@/core/components/ui/button';
import { GameMode } from '@/core/features/dudo/types';

interface NewGameControlsProps {
  onStartNewGame: (gameMode: GameMode) => void;
}

const NewGameControls: React.FC<NewGameControlsProps> = ({
  onStartNewGame,
}) => {
  return (
    <div className="flex-center gap-6">
      <div className="text-center">
        <Button variant="accent" onClick={() => onStartNewGame('blitz')}>
          Blitz
        </Button>
        <p className="mt-3 text-xs text-muted leading-relaxed">3 x 3 dice</p>
      </div>
      <div className="text-center">
        <Button variant="accent" onClick={() => onStartNewGame('rapid')}>
          Rapid
        </Button>
        <p className="mt-3 text-xs text-muted">3 x 5 dice</p>
      </div>
      <div className="text-center">
        <Button variant="accent" onClick={() => onStartNewGame('standart')}>
          Standart
        </Button>
        <p className="mt-3 text-xs text-muted leading-relaxed">5 x 5 dice</p>
      </div>
    </div>
  );
};

export default NewGameControls;
