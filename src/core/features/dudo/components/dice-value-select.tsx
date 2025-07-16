'use client';

import Dice from '@/core/features/dudo/components/dice';

const values = Array.from({ length: 6 }, (_, i) => i + 1);

interface DiceValueSelectProps {
  inputValue: number;
  onSelect: (value: number) => void;
}

const DiceValueSelect = ({ inputValue, onSelect }: DiceValueSelectProps) => {
  return (
    <>
      <div className="dudo_dice_select dudo_dice_select--small-screen">
        {values.map((value) => (
          <Dice
            size="lg"
            value={value}
            onClick={onSelect}
            key={value}
            inputValue={inputValue}
          />
        ))}
      </div>
      <div className="dudo_dice_select dudo_dice_select--normal-screen">
        {values.map((value) => (
          <Dice
            size="md"
            value={value}
            onClick={onSelect}
            key={value}
            inputValue={inputValue}
          />
        ))}
      </div>
    </>
  );
};

export default DiceValueSelect;
