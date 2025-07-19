import React, { useMemo } from 'react';

import Dice from '@/core/features/dudo/components/dice';
import { GamePhase, Player } from '@/core/features/dudo/types';

interface DiceRollProps {
  isRolling: boolean;
  isMainPlayerLost: boolean;
  gamePhase: GamePhase;
  winner: Player | null;
  playerDice: number[];
}

const DiceRoll: React.FC<DiceRollProps> = ({
  isRolling,
  isMainPlayerLost,
  gamePhase,
  winner,
  playerDice,
}) => {
  // Memoized dice display content
  const diceDisplayContent = useMemo(() => {
    if (isRolling || isMainPlayerLost) return null;

    const showDiceTitle = gamePhase !== 'rolling' || winner;

    return (
      <div className="w-32 pt-2 pb-4 flex-center flex-col gap-3">
        {showDiceTitle && (
          <div className="text-center text-xl text-title font-bold">
            Your dice
          </div>
        )}
        <div className="flex justify-center flex-wrap gap-3">
          {playerDice.map((die: number, index: number) => (
            <Dice key={index} value={die} isRolling />
          ))}
        </div>
      </div>
    );
  }, [isRolling, isMainPlayerLost, gamePhase, winner, playerDice]);

  return (
    <>
      {/* {rollSectionContent} */}
      {diceDisplayContent}
    </>
  );
};

export default DiceRoll;
