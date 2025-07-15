'use client';

import { Button } from '@/core/components/ui/button';
import { cn } from '@/core/utils/common';
import { Card, CardContent } from '@/core/components/ui/card';
import { Bet } from '@/core/features/dudo/types';
import DiceValueSelect from '@/core/features/dudo/components/dice-value-select';
import DiceCountSelect from '@/core/features/dudo/components/dice-count-select';
import AnimatedAppear from '@/core/components/shared/animated-appear';

export interface GameControlsProps {
  currentBet: Bet | null;
  inputCount: number;
  inputValue: number;
  isGameControls: boolean;
  totalDiceCount: number;
  onDiceCountUpdate: (value: number) => void;
  onDiceValueUpdate: (value: number) => void;
  onChallengeBet: () => void;
  onMakeBet: () => void;
}

const GameControls = ({
  inputCount,
  inputValue,
  currentBet,
  isGameControls,
  totalDiceCount,
  onDiceCountUpdate,
  onDiceValueUpdate,
  onChallengeBet,
  onMakeBet,
}: GameControlsProps) => {
  const handleCountUpdate = (newValue: number) => {
    onDiceCountUpdate(newValue);
  };

  const handleValueUpdate = (newValue: number) => {
    onDiceValueUpdate(newValue);
  };

  return (
    <div className="w-full h-[112px] rounded-xl bg-card/30">
      <AnimatedAppear isShown={isGameControls}>
        <Card>
          <CardContent className="py-6 flex-center">
            <div className="flex-center gap-4">
              <DiceCountSelect
                value={inputCount}
                min={1}
                max={totalDiceCount}
                onChange={handleCountUpdate}
              />

              <DiceValueSelect
                onSelect={handleValueUpdate}
                inputValue={inputValue}
              />

              <Button variant="positive" onClick={onMakeBet}>
                Make bet
              </Button>

              <Button
                className={cn({
                  'opacity-20 pointer-events-none': !currentBet?.count,
                })}
                variant={currentBet?.count ? 'negative' : 'ghost'}
                onClick={onChallengeBet}
              >
                Challenge!
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedAppear>
    </div>
  );
};

export default GameControls;
