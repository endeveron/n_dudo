import {
  BehaviorAnalysis,
  BettingContext,
  GameStateAnalysis,
  ProbabilityAnalysis,
} from '@/core/features/dudo/types/advanced-logic';
import { getValuableDiceNumber } from '@/core/features/dudo/utils';
import { calculateGameProgression } from '@/core/features/dudo/utils/advanced-logic';
import { calculateSuspicionLevel } from '@/core/features/dudo/utils/advanced-player-analysis';
import { calculateBinomialProbability } from '@/core/features/dudo/utils/advanced-probability-utils';

export const analyzeProbabilities = (
  context: BettingContext
): ProbabilityAnalysis => {
  const { currentBet, myDice, totalDiceCount } = context;

  if (!currentBet) {
    // No bet to analyze yet — cannot compute probabilities.
    return {
      myCount: 0,
      expectedTotal: 0,
      actualProbability: 0,
      confidenceLevel: 0,
    };
  }

  // Count my dice that match the current bet
  const myCount = getValuableDiceNumber(myDice, currentBet.value);
  const remainingDice = totalDiceCount - myDice.length;

  // Calculate probability for remaining dice
  const probabilityPerDie = currentBet.value === 1 ? 1 / 6 : 2 / 6; // 1s are wild except when betting on 1s
  const neededCount = Math.max(0, currentBet.count - myCount);

  const actualProbability = calculateBinomialProbability(
    remainingDice,
    probabilityPerDie,
    neededCount
  );

  const expectedTotal = myCount + remainingDice * probabilityPerDie;

  return {
    myCount,
    expectedTotal,
    actualProbability,
    // PREV:
    // confidenceLevel: actualProbability * 0.8 + 0.2, // Add base confidence
    // NEW: This gives higher confidence when probability is high, with a reasonable cap
    confidenceLevel: Math.min(0.95, actualProbability * 0.9 + 0.1), // Add base confidence
  };
};

export const analyzeBehavior = (context: BettingContext): BehaviorAnalysis => {
  const { gameHistory, playerProfiles, lastBettorId } = context;

  const lastBettorProfile = playerProfiles.get(lastBettorId) || null;

  // Calculate suspicion level
  const suspicionLevel = calculateSuspicionLevel(
    lastBettorProfile,
    context.currentBet,
    context.totalDiceCount
  );

  // Analyze recent game patterns
  const recentChallenges = gameHistory
    .slice(-5)
    .filter((h) => h.action === 'challenge');
  const recentBluffRate =
    recentChallenges.length > 0
      ? recentChallenges.filter((c) => c.result?.betWasCorrect).length /
        recentChallenges.length
      : 0.3;

  const recentBets = gameHistory.slice(-5).filter((h) => h.action === 'bet');
  const bettingAggression =
    recentBets.length > 0
      ? recentBets.reduce((sum, bet) => sum + (bet.bet?.count || 0), 0) /
        recentBets.length /
        context.totalDiceCount
      : 0.3;

  return {
    suspicionLevel,
    lastBettorProfile,
    recentBluffRate,
    bettingAggression,
  };
};

export const analyzeGameState = (
  context: BettingContext
): GameStateAnalysis => {
  const { activePlayerCount, initialDiceCount, totalDiceCount } = context;

  const gameProgression = calculateGameProgression({
    initialDiceCount,
    totalDiceCount,
  });
  const eliminationPressure = Math.max(0, (5 - activePlayerCount) / 4);
  const diceScarcity = Math.max(0, (25 - totalDiceCount) / 25);
  const urgencyLevel = gameProgression * 0.4 + eliminationPressure * 0.6;

  return {
    gameProgression,
    eliminationPressure,
    diceScarcity,
    urgencyLevel,
  };
};

export const roundValue = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return value < 0
    ? Math.floor(value * factor) / factor
    : Math.ceil(value * factor) / factor;
};
