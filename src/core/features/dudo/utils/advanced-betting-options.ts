import { BOT_PERSONALITIES } from '@/core/features/dudo/constants/advanced-bot-personalities';
import {
  BettingContext,
  BettingOption,
} from '@/core/features/dudo/types/advanced-logic';
import { getValuableDiceNumber } from '@/core/features/dudo/utils';
import { calculateBinomialProbability } from '@/core/features/dudo/utils/advanced-probability-utils';
// import { roundValue } from '@/core/features/dudo/utils/advanced-probability-analysis';

export const generateBettingOptions = (
  context: BettingContext
): BettingOption[] => {
  const { currentBet, totalDiceCount, myDice } = context;
  const options: BettingOption[] = [];

  if (!currentBet) {
    // First move – suggest opening bets
    const valueCounts: Record<number, number> = {};
    for (const die of myDice) {
      valueCounts[die] = (valueCounts[die] || 0) + 1;
    }

    const mostCommonValue = Object.entries(valueCounts).reduce((a, b) =>
      a[1] >= b[1] ? a : b
    )[0];

    const myCount = getValuableDiceNumber(myDice, Number(mostCommonValue));

    options.push({
      count: Math.max(1, myCount),
      value: Number(mostCommonValue),
      type: 'conservative',
      riskTolerance: BOT_PERSONALITIES['conservative'].riskTolerance,
      expectedValue: 0,
    });

    return options;
  }

  // Conservative raise (count + 1)
  if (currentBet.count < totalDiceCount) {
    options.push({
      count: currentBet.count + 1,
      value: currentBet.value,
      type: 'conservative',
      riskTolerance: BOT_PERSONALITIES['conservative'].riskTolerance,
      expectedValue: 0,
    });
  }

  // Analytical (same count, higher value)
  if (currentBet.value < 6) {
    options.push({
      count: currentBet.count,
      value: currentBet.value + 1,
      type: 'analytical',
      riskTolerance: BOT_PERSONALITIES['analytical'].riskTolerance,
      expectedValue: 0,
    });
  }

  // Aggressive raise (count + 2 or more)
  if (currentBet.count + 2 <= totalDiceCount) {
    options.push({
      count: currentBet.count + 2,
      value: currentBet.value,
      type: 'aggressive',
      riskTolerance: BOT_PERSONALITIES['aggressive'].riskTolerance,
      expectedValue: 0,
    });
  }

  // Bluff bet (significantly higher than expected)
  const bluffCount = Math.min(totalDiceCount, Math.floor(totalDiceCount * 0.6));
  if (bluffCount > currentBet.count) {
    options.push({
      count: bluffCount,
      value: currentBet.value,
      type: 'bluffer',
      riskTolerance: BOT_PERSONALITIES['bluffer'].riskTolerance,
      expectedValue: 0,
    });
  }

  return options;
};

export const evaluateBettingOption = (
  option: BettingOption,
  context: BettingContext
  // probAnalysis: ProbabilityAnalysis,
): BettingOption => {
  // Prepare decision for logging
  // const probAnalysisData = {
  //   ...probAnalysis,
  //   actualProbability: roundValue(probAnalysis.actualProbability),
  //   expectedTotal: roundValue(probAnalysis.expectedTotal),
  //   confidenceLevel: roundValue(probAnalysis.confidenceLevel),
  // };
  // console.info('evaluateBettingOption > probAnalysis', probAnalysisData);

  const { myDice, totalDiceCount } = context;
  const remainingDice = totalDiceCount - myDice.length;
  const myCount = getValuableDiceNumber(myDice, option.value);
  const neededCount = Math.max(0, option.count - myCount);

  const probabilityPerDie = option.value === 1 ? 1 / 6 : 2 / 6;
  const successProbability = calculateBinomialProbability(
    remainingDice,
    probabilityPerDie,
    neededCount
  );

  const expectedValue = successProbability * 1 + (1 - successProbability) * -1;

  return {
    ...option,
    expectedValue,
  };
};
