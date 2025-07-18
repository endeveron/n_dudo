import { Bet, Player } from '@/core/features/dudo/types';
import { Decision } from '@/core/features/dudo/types/advanced-logic';
import {
  GameAnalysis,
  PremiumBetParams,
} from '@/core/features/dudo/types/premium-logic';
import { getValuableDiceNumber } from '@/core/features/dudo/utils';

export const getPremiumDecision = ({
  currentBet,
  players,
}: PremiumBetParams): {
  decision: Decision | null;
  confidence: number;
} => {
  const errResult = {
    decision: null,
    confidence: 0,
  };

  if (!currentBet) {
    console.error('No current bet');
    return errResult;
  }

  // Filter active players
  const activePlayers = players.filter((p) => p.isActive);
  if (!activePlayers.length) {
    console.error('No active players');
    return errResult;
  }

  const currentPlayer = players[0];
  if (!currentPlayer) {
    console.error('Current player not found');
    return errResult;
  }

  // Enhanced analysis with perfect information
  const analysis = analyzePremiumGameState({
    activePlayers,
    currentBet,
  });

  // Make optimal decision using perfect information
  const result = makeOptimalPremiumDecision(
    analysis,
    currentBet,
    activePlayers,
    currentPlayer
  );

  return result;
};

function analyzePremiumGameState({
  activePlayers,
  currentBet,
}: {
  activePlayers: Player[];
  currentBet: Bet;
}): GameAnalysis {
  const { count: betCount, value: betValue } = currentBet;

  // Get all dice from active players
  const allDice = activePlayers.flatMap((player) => player.dice);

  // Count actual dice matching the bet value
  const actualCount = getValuableDiceNumber(allDice, betValue);

  // Calculate total dice in play
  const totalDice = activePlayers.reduce(
    (sum, player) => sum + player.diceCount,
    0
  );

  // Create a map of all dice counts for strategic analysis
  const allDiceCounts = new Map<number, number>();
  for (let value = 1; value <= 6; value++) {
    allDiceCounts.set(value, getValuableDiceNumber(allDice, value));
  }

  // Calculate expected count based on probability (for reference)
  const expectedCount = Math.round(totalDice * (1 / 3));

  // With perfect information, probability is binary
  const probability = actualCount >= betCount ? 1.0 : 0.0;

  // Determine if current bet is valid
  const isCurrentBetValid = actualCount >= betCount;

  // Assess risk level with perfect information
  let riskLevel: 'low' | 'medium' | 'high';
  if (isCurrentBetValid) {
    riskLevel = 'low'; // We know it's true
  } else {
    const deficit = betCount - actualCount;
    riskLevel = deficit === 1 ? 'medium' : 'high';
  }

  return {
    actualCount,
    expectedCount,
    probability,
    isCurrentBetValid,
    riskLevel,
    allDiceCounts,
    totalDice,
  };
}

function makeOptimalPremiumDecision(
  analysis: GameAnalysis,
  currentBet: Bet,
  activePlayers: Player[],
  currentPlayer: Player
): { decision: Decision | null; confidence: number } {
  const { isCurrentBetValid, allDiceCounts, totalDice } = analysis;

  // If current bet is false, challenge with maximum confidence
  if (!isCurrentBetValid) {
    return {
      decision: 'challenge',
      confidence: 98, // Near maximum confidence since we have perfect information
    };
  }

  // Current bet is true, find the most strategic bet to make
  const optimalBet = findMostStrategicBet(
    currentBet,
    allDiceCounts,
    totalDice,
    currentPlayer,
    activePlayers
  );

  if (optimalBet) {
    const confidence = calculateStrategicConfidence(
      optimalBet,
      allDiceCounts,
      currentPlayer
    );
    return {
      decision: optimalBet,
      confidence: Math.round(confidence * 100),
    };
  }

  // Fallback to challenge (this should rarely happen with perfect info)
  return {
    decision: null,
    confidence: 0,
  };
}

function findMostStrategicBet(
  currentBet: Bet,
  allDiceCounts: Map<number, number>,
  totalDice: number,
  currentPlayer: Player,
  activePlayers: Player[]
): Bet | null {
  const validBets: Array<{ bet: Bet; score: number }> = [];

  // Generate all possible valid bets that we know are true
  for (let value = 1; value <= 6; value++) {
    const actualCount = allDiceCounts.get(value) || 0;

    // Only consider bets we know are true
    for (let count = 1; count <= actualCount; count++) {
      const bet = { count, value };

      if (isValidBet(bet, currentBet)) {
        const score = evaluateStrategicBet(
          bet,
          allDiceCounts,
          currentPlayer,
          activePlayers
        );
        validBets.push({ bet, score });
      }
    }
  }

  // Sort by score and return the best bet
  validBets.sort((a, b) => b.score - a.score);
  return validBets.length > 0 ? validBets[0].bet : null;
}

function evaluateStrategicBet(
  bet: Bet,
  allDiceCounts: Map<number, number>,
  currentPlayer: Player,
  activePlayers: Player[]
): number {
  const { count, value } = bet;
  const actualCount = allDiceCounts.get(value) || 0;

  let score = 0;

  // 1. Aggressiveness score - bets closer to actual count are more likely to be challenged
  const aggressivenessFactor = count / actualCount;
  score += aggressivenessFactor * 40;

  // 2. Player hand strength - bonus for having matching dice (makes bet less suspicious)
  const playerMatches = currentPlayer.dice.filter(
    (die) => die === value || (value !== 1 && die === 1)
  ).length;
  score += playerMatches * 8;

  // 3. Value preference - certain values are more commonly bet on
  const valuePreference = [0, 15, 10, 8, 8, 8, 12]; // Index 0 unused, 1s and 6s slightly preferred
  score += valuePreference[value];

  // 4. Opponent analysis - consider what opponents might think
  const otherPlayersTotal = activePlayers
    .slice(1)
    .reduce((sum, p) => sum + p.diceCount, 0);
  const expectedByOpponents = Math.round(otherPlayersTotal * (1 / 3));

  if (count > expectedByOpponents) {
    score += 15; // Bonus for bets that seem aggressive to opponents
  }

  // 5. Elimination potential - higher counts more likely to eliminate opponents
  if (count > actualCount * 0.8) {
    score += 20;
  }

  // 6. Safety margin - penalize bets that are too close to the actual count
  const safetyMargin = actualCount - count;
  if (safetyMargin < 2) {
    score += 25; // Bonus for risky but still true bets
  }

  // 7. Special handling for 1s
  if (value === 1) {
    // 1s bets are often underestimated by opponents
    score += 10;
  }

  return score;
}

function calculateStrategicConfidence(
  bet: Bet,
  allDiceCounts: Map<number, number>,
  currentPlayer: Player
  // activePlayers: Player[]
): number {
  const { count, value } = bet;
  const actualCount = allDiceCounts.get(value) || 0;

  // Base confidence is high since we know the bet is true
  let confidence = 0.75;

  // Adjust based on how aggressive the bet is
  const aggressiveness = count / actualCount;
  confidence += Math.min(0.15, aggressiveness * 0.15);

  // Bonus for having supporting dice in hand
  const playerMatches = currentPlayer.dice.filter(
    (die) => die === value || (value !== 1 && die === 1)
  ).length;
  confidence += Math.min(0.1, playerMatches * 0.03);

  // Slight penalty for very aggressive bets (more likely to be challenged)
  if (aggressiveness > 0.9) {
    confidence -= 0.05;
  }

  return Math.min(0.95, Math.max(0.6, confidence));
}

function isValidBet(newBet: Bet, currentBet: Bet): boolean {
  return (
    newBet.count > currentBet.count ||
    (newBet.count === currentBet.count && newBet.value > currentBet.value)
  );
}
