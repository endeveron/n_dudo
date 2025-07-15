'use client';

import Dice from '@/core/features/dudo/components/dice';

const values = Array.from({ length: 6 }, (_, i) => i + 1);

interface DiceValueSelectProps {
  inputValue: number;
  onSelect: (value: number) => void;
}

const DiceValueSelect = ({ inputValue, onSelect }: DiceValueSelectProps) => {
  return (
    <div className="w-24 mx-2 flex-center flex-wrap gap-2">
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
  );
};

export default DiceValueSelect;
