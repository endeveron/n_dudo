export const getValuableDiceNumber = (dice: number[], value: number) => {
  if (value === 1) {
    // When betting on 1s, only 1s count (they're not wild when betting on them)
    return dice.filter((d) => d === 1).length;
  } else {
    // For other values, 1s are wild
    return dice.filter((d) => d === value || d === 1).length;
  }
};
