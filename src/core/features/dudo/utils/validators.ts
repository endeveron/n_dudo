import { Bet } from '@/core/features/dudo/types';

export const validateBet = ({
  bet,
  // totalDiceCount,
  errMsg,
}: {
  bet: Bet;
  // totalDiceCount: number;
  errMsg?: string;
}) => {
  const isValid =
    bet.count >= 1 &&
    // bet.count <= totalDiceCount &&
    bet.value >= 1 &&
    bet.value <= 6;
  if (!isValid) {
    console.error(`validateBet: ${errMsg ?? 'Invalid bet'}`, bet);
  }
  // console.log('validateBet:', isValid, bet);

  return isValid;
};

export const validateDice = (dice: number | number[], errMsg?: string) => {
  let isValid = false;

  const validateValue = (value: number) => {
    return value >= 1 && value <= 6;
  };

  if (typeof dice === 'number') {
    isValid = validateValue(dice);
  }

  if (Array.isArray(dice)) {
    isValid = dice.every(validateValue);
  }

  if (!isValid) {
    console.error(`validateDice: ${errMsg ?? 'Invalid dice'}`, dice);
  }

  return isValid;
};
