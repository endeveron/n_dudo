'use client';

import { useMemo, useState } from 'react';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import { Button } from '@/core/components/ui/button';
import DiceCountSelect from '@/core/features/dudo/components/dice-count-select';
import DiceValueSelect from '@/core/features/dudo/components/dice-value-select';
import { Bet, GameMode } from '@/core/features/dudo/types';
import { cn } from '@/core/utils/common';
import { Card } from '@/core/components/shared/card';

export interface GameControlsProps {
  currentBet: Bet | null;
  gameMode: string;
  inputCount: number;
  isGameControls: boolean;
  inputValue: number;
  isMainPlayerLost: boolean;
  isRolling: boolean;
  roundNumber: number;
  totalDiceCount: number;
  onDiceCountUpdate: (value: number) => void;
  onDiceValueUpdate: (value: number) => void;
  onChallengeBet: () => void;
  onMakeBet: () => void;
  onRollDice: () => void;
  onStartNewGame: (gameMode: GameMode) => void;
}

const GameControls = ({
  currentBet,
  isMainPlayerLost,
  gameMode,
  inputCount,
  inputValue,
  isGameControls,
  isRolling,
  roundNumber,
  totalDiceCount,
  onDiceCountUpdate,
  onDiceValueUpdate,
  onChallengeBet,
  onMakeBet,
  onRollDice,
  onStartNewGame,
}: GameControlsProps) => {
  const [isProcessing, setProcessing] = useState(false);

  const handleCountUpdate = (newValue: number) => {
    onDiceCountUpdate(newValue);
  };

  const handleValueUpdate = (newValue: number) => {
    onDiceValueUpdate(newValue);
  };

  const handleMakeBet = () => {
    if (isProcessing) return;

    setProcessing(true);
    onMakeBet();

    setTimeout(() => {
      setProcessing(false);
    }, 1000);
  };

  // Memoized roll section content
  const rollSectionContent = useMemo(() => {
    if (!isRolling) return null;

    return (
      <AnimatedAppear
        className={cn('dudo_game-controls_roll', isRolling ? 'z-10' : 'z-0')}
        isShown={isRolling}
      >
        <>
          <div className="text-xl font-bold text-title leading-none">
            Round {roundNumber}
          </div>

          <div className="flex gap-6">
            {isMainPlayerLost && (
              <Button
                variant="accent"
                onClick={() => onStartNewGame(gameMode as GameMode)}
              >
                New game
              </Button>
            )}
            <Button variant="accent" onClick={onRollDice}>
              Roll dice
            </Button>
          </div>
        </>
      </AnimatedAppear>
    );
  }, [
    isMainPlayerLost,
    gameMode,
    isRolling,
    roundNumber,
    onRollDice,
    onStartNewGame,
  ]);

  return (
    <Card className="dudo_game-controls">
      <AnimatedAppear
        className={cn(
          'dudo_game-controls_bet',
          isGameControls ? 'z-10' : 'z-0'
        )}
        isShown={isGameControls}
        duration="fast"
      >
        <div className="flex-center gap-4">
          <DiceCountSelect
            value={inputCount}
            min={1}
            max={totalDiceCount}
            isProcessing={isProcessing}
            onChange={handleCountUpdate}
          />

          <DiceValueSelect
            onSelect={handleValueUpdate}
            inputValue={inputValue}
          />
        </div>

        <div className="flex-center gap-6 sm:flex-row-reverse sm:gap-4">
          <Button
            className={cn(
              (isProcessing || !currentBet?.count) &&
                'opacity-0 pointer-events-none'
            )}
            variant="danger"
            onClick={onChallengeBet}
          >
            Challenge!
          </Button>

          <Button variant="accent" onClick={handleMakeBet}>
            Place bet
          </Button>
        </div>
      </AnimatedAppear>

      {rollSectionContent}
    </Card>
  );
};

export default GameControls;
