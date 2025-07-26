'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

import { cn } from '@/core/utils/common';

interface DiceCountSelectProps {
  // label: string;
  value: number;
  min: number;
  max: number;
  isProcessing?: boolean;
  onChange: (value: number) => void;
}

const DiceCountSelect = ({
  value,
  min,
  max,
  isProcessing,
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
    <div className="my-2 flex items-center rounded-md bg-card dark:bg-white/7 border-card-border dark:border-card-border/50 border-1">
      <button
        onClick={decrement}
        disabled={value <= min || isProcessing}
        className="flex-center w-12 h-12 disabled:opacity-50 cursor-pointer disabled:cursor-default transition-colors"
        type="button"
      >
        <Minus
          size={32}
          className={cn(value > min ? 'text-title' : 'text-system')}
        />
      </button>

      <div className={cn('flex-1 text-center', isProcessing && 'opacity-0')}>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-10 text-center text-accent text-4xl font-bold bg-transparent border-none rounded-sm outline-none appearance-none cursor-default"
          style={{ MozAppearance: 'textfield' }}
        />
      </div>

      <button
        onClick={increment}
        disabled={value >= max || isProcessing}
        className="flex-center w-12 h-12 disabled:opacity-50 cursor-pointer disabled:cursor-default transition-colors"
        type="button"
      >
        <Plus
          size={32}
          className={cn(value < max ? 'text-title' : 'text-system')}
        />
      </button>
    </div>
  );
};

export default DiceCountSelect;
