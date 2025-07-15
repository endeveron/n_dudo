import React, { useMemo } from 'react';

import { Button } from '@/core/components/ui/button';
import Dice from '@/core/features/dudo/components/dice';
import { GameMode, GamePhase, Player } from '@/core/features/dudo/types';

interface DiceRollProps {
  rolling: boolean;
  mainPlayerLost: boolean;
  gamePhase: GamePhase;
  winner: Player | null;
  playerDice: number[];
  gameMode: string;
  onRollDice: () => void;
  onStartNewGame: (gameMode: GameMode) => void;
}

const DiceRoll: React.FC<DiceRollProps> = ({
  rolling,
  mainPlayerLost,
  gamePhase,
  winner,
  playerDice,
  gameMode,
  onRollDice,
  onStartNewGame,
}) => {
  // Memoized roll section content
  const rollSectionContent = useMemo(() => {
    if (!rolling) return null;

    return (
      <div className="flex-center flex-col gap-4">
        <Button variant="accent" onClick={onRollDice}>
          Roll dice
        </Button>
        {mainPlayerLost && (
          <Button
            variant="secondary"
            onClick={() => onStartNewGame(gameMode as GameMode)}
          >
            New game
          </Button>
        )}
      </div>
    );
  }, [rolling, mainPlayerLost, gameMode, onRollDice, onStartNewGame]);

  // Memoized dice display content
  const diceDisplayContent = useMemo(() => {
    if (rolling || mainPlayerLost) return null;

    const showDiceTitle = gamePhase !== 'rolling' || winner;

    return (
      <div className="flex-center flex-col gap-3">
        {showDiceTitle && (
          <div className="text-center text-xl text-accent font-bold">
            Your dice
          </div>
        )}
        <div className="flex justify-center flex-wrap gap-3">
          {playerDice.map((die: number, index: number) => (
            <Dice key={index} value={die} rolling />
          ))}
        </div>
      </div>
    );
  }, [rolling, mainPlayerLost, gamePhase, winner, playerDice]);

  return (
    <>
      {rollSectionContent}
      {diceDisplayContent}
    </>
  );
};

export default DiceRoll;
