'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

import { cn } from '@/core/utils/common';

interface DiceCountSelectProps {
  // label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const DiceCountSelect = ({
  // label,
  value,
  min,
  max,
  onChange,
}: DiceCountSelectProps) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex-1">
      {/* <label className="h-5 block text-center text-sm text-accent font-bold">
        {label}
      </label> */}
      <div className="my-2 flex items-center rounded-md bg-white/30 dark:bg-white/7">
        <button
          onClick={decrement}
          disabled={value <= min}
          className="flex-center w-12 h-12 disabled:opacity-50 cursor-pointer disabled:cursor-default transition-colors"
          type="button"
        >
          <Minus
            size={32}
            className={cn(value > min ? 'text-accent' : 'text-system')}
          />
        </button>

        <div className="flex-1 text-center">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={handleInputChange}
            className="w-10 text-center text-4xl font-bold bg-transparent border-none outline-none appearance-none cursor-default"
            style={{ MozAppearance: 'textfield' }}
          />
          {/* {unit && <div className="text-xs text-muted mt-1">{unit}</div>} */}
        </div>

        <button
          onClick={increment}
          disabled={value >= max}
          className="flex-center w-12 h-12 disabled:opacity-50 cursor-pointer disabled:cursor-default transition-colors"
          type="button"
        >
          <Plus
            size={32}
            className={cn(value < max ? 'text-accent' : 'text-system')}
          />
        </button>
      </div>
      {/* <div className="h-5 text-xs text-system text-center">
        Range: {min} - {max}
      </div> */}
    </div>
  );
};

export default DiceCountSelect;
