import { FORCED_CHALLENGE_PROBABILITY } from '@/core/features/dudo/constants';
import { BOT_PERSONALITIES } from '@/core/features/dudo/constants/advanced-bot-personalities';
import {
  AdvancedBetParams,
  BehaviorAnalysis,
  BettingContext,
  BettingOption,
  BotPersonality,
  Decision,
  GameStateAnalysis,
  ProbabilityAnalysis,
  Strategy,
} from '@/core/features/dudo/types/advanced-logic';
import {
  evaluateBettingOption,
  generateBettingOptions,
} from '@/core/features/dudo/utils/advanced-betting-options';
import { updatePlayerProfile } from '@/core/features/dudo/utils/advanced-player-analysis';
import {
  analyzeBehavior,
  analyzeGameState,
  analyzeProbabilities,
} from '@/core/features/dudo/utils/advanced-probability-analysis';

// v 1
// export const calculateChallengeProbability = (
//   personality: BotPersonality,
//   probAnalysis: ProbabilityAnalysis,
//   behaviorAnalysis: BehaviorAnalysis,
//   gameStateAnalysis: GameStateAnalysis
// ): number => {
//   let challengeProb = 0;

//   // Base challenge probability from personality
//   challengeProb += personality.challengeThreshold * 0.3;

//   // Probability-based challenge
//   if (probAnalysis.actualProbability < 0.2) {
//     challengeProb += 0.5;
//   } else if (probAnalysis.actualProbability < 0.4) {
//     challengeProb += 0.3;
//   } else if (probAnalysis.actualProbability < 0.6) {
//     challengeProb += 0.1;
//   }

//   // NEW: Use contextual confidence adjustment
//   const confidenceAdjustment = () => {
//     // If we're very confident in our analysis, trust it more
//     if (probAnalysis.confidenceLevel > 0.8) {
//       return probAnalysis.confidenceLevel * 0.2;
//     }
//     return 0;
//   };

//   challengeProb += confidenceAdjustment();

//   // Behavior-based challenge
//   challengeProb += behaviorAnalysis.suspicionLevel * 0.4;

//   // Game state adjustments
//   challengeProb += gameStateAnalysis.urgencyLevel * 0.2;

//   // Analytical depth modifier
//   challengeProb *= 0.5 + personality.analyticalDepth * 0.5;

//   return Math.max(0, Math.min(1, challengeProb));
// };
//
// v2
// More realistic reaction to probability — smooth scaling rather than thresholds.
// Higher suspicion when probability is low and confidence is high.
// Still includes behavior and urgency influences.
// Personality influences both base and final weighting.
export const calculateChallengeProbability = ({
  behaviorAnalysis,
  challengeProbCoefficient = 1, // Default to 1 (no change)
  gameStateAnalysis,
  personality,
  probAnalysis,
}: {
  personality: BotPersonality;
  probAnalysis: ProbabilityAnalysis;
  behaviorAnalysis: BehaviorAnalysis;
  gameStateAnalysis: GameStateAnalysis;
  challengeProbCoefficient: number;
}): number => {
  let challengeProb = 0;

  // Base challenge probability from personality
  challengeProb += personality.challengeThreshold * 0.5; // Initial 0.3
  //                    0.5   0.3
  // Conservative	 0.4	1.0	  0.12
  // Aggressive	   0.7	1.05	1.21
  // Analytical	   0.3	1.10	0.09
  // Bluffer	     0.5	0.9 	0.15

  // Sanity check: if we already have enough dice, don't challenge
  if (probAnalysis.myCount >= probAnalysis.expectedTotal * 0.8) {
    challengeProb *= 0.1; // Drammatically reduce challenge probability
  }

  // // Apply an additional reduction factor
  // if (
  //   probAnalysis.actualProbability > 0.8 &&
  //   probAnalysis.confidenceLevel > 0.7
  // ) {
  //   challengeProb *= 0.2; // Reduce when both probability and confidence are high
  // }

  // Probability-based challenge (sigmoid-based logic)
  const probabilityWeight = (p: number): number => {
    const k = 6;
    return 1 / (1 + Math.exp(-k * (p - 0.5)));
  };

  const probWeight = probabilityWeight(probAnalysis.actualProbability);

  // Integrate confidence into weight scaling (more confidence = more influence)
  // challengeProb += probWeight * (0.3 + probAnalysis.confidenceLevel * 0.2);
  challengeProb += probWeight * (0.3 + probAnalysis.confidenceLevel * 0.2);

  // Behavior-based challenge
  challengeProb += behaviorAnalysis.suspicionLevel * 0.4; // Initial 0.4

  // Game state adjustments
  challengeProb += gameStateAnalysis.urgencyLevel * 0.2; // Initial 0.2

  // Decrease `challengeProb` based on bot analytical depth modifier
  challengeProb *= 0.5 + personality.analyticalDepth * 0.5;
  // Conservative	 0.6	0.80
  // Aggressive	   0.4	0.70
  // Analytical	   0.9	0.95
  // Bluffer	     0.3	0.65

  // Apply the probability coefficient for correction
  challengeProb *= challengeProbCoefficient;

  // Clamp final value to [0, 1]
  return Math.max(0, Math.min(1, challengeProb));
};

export const selectBestBettingOption = ({
  options,
  personality,
  probAnalysis,
  preferredStrategy,
}: {
  options: BettingOption[];
  personality: BotPersonality;
  // context: BettingContext;
  probAnalysis: ProbabilityAnalysis;
  preferredStrategy?: Strategy;
}): BettingOption => {
  let bestOption = options[0];
  let bestScore = -Infinity;

  if (!preferredStrategy) {
    for (const option of options) {
      let score = 0;

      // Expected value weight
      score += option.expectedValue * 0.4;

      // Personality-based scoring
      switch (option.type) {
        case 'conservative':
          score += (1 - personality.aggressionLevel) * 0.3;
          break;
        case 'aggressive':
          score += personality.aggressionLevel * 0.3;
          break;
        case 'analytical':
          score += personality.analyticalDepth * 0.2;
          break;
        case 'bluffer':
          score += personality.bluffTendency * 0.5;
          break;
      }

      // Risk tolerance adjustment - NOW USING ADJUSTED RISK from betting-options.ts > riskAdjustment()
      score -= option.riskTolerance * (1 - personality.riskTolerance) * 0.3;

      // PREV: Confidence modifier
      // score += probAnalysis.confidenceLevel * 0.2;

      // NEW: Contextual value bonus
      const contextualBonus = () => {
        let bonus = 0;
        const contributionRatio = probAnalysis.myCount / option.count;
        if (contributionRatio > 0.5) bonus += 0.15;

        if (probAnalysis.confidenceLevel > 0.8) bonus += 0.1;
        return bonus;
      };

      score += contextualBonus();

      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    }
  } else {
    const matchingOption = options.find((o) => o.type === preferredStrategy);
    bestOption = matchingOption || options[0];
  }

  return bestOption;
};

// Bot decision entry point
export const makeAdvancedDecision = ({
  context,
  isBot,
  personality,
  preferredStrategy,
}: {
  context: BettingContext;
  isBot?: boolean;
  personality: BotPersonality;
  preferredStrategy?: Strategy;
}): Decision => {
  // Update player profiles
  const updatedProfiles = new Map(context.playerProfiles);
  updatedProfiles.set(
    context.lastBettorId,
    updatePlayerProfile(
      context.playerProfiles.get(context.lastBettorId) || null,
      context.gameHistory,
      context.lastBettorId
    )
  );

  const { currentBet, myDice, totalDiceCount } = context;
  let challengeAllowed = true;

  if (currentBet) {
    // Avoid challenge if the player has the current bet dice
    const curBetCount = currentBet.count;
    const valuableDice = getValuableDiceNumber(myDice, currentBet.value);

    if (valuableDice >= curBetCount) {
      challengeAllowed = false;
    }

    if (challengeAllowed) {
      // Handle near-maximum and maximum count cases
      // These are statistically impossible or extremely improbable
      if (curBetCount >= totalDiceCount - 1) {
        return 'challenge';
      }

      if (isBot) {
        const isChallenge = Math.random() < FORCED_CHALLENGE_PROBABILITY;
        if (isChallenge) return 'challenge';
      }
    }
  }

  const updatedContext = { ...context, playerProfiles: updatedProfiles };

  // Analyze current situation
  const probAnalysis = analyzeProbabilities(updatedContext);
  const behaviorAnalysis = analyzeBehavior(updatedContext);
  const gameStateAnalysis = analyzeGameState(updatedContext);

  // Determine if we should challenge
  const challengeProbability = calculateChallengeProbability({
    personality,
    probAnalysis,
    behaviorAnalysis,
    gameStateAnalysis,
    challengeProbCoefficient: 1.025,
  });

  // // Logging for probability analysis
  // if (context.lastBettorId === 2) {
  //   console.log(
  //     'challengeProbability',
  //     roundValue(challengeProbability),
  //     '\n\n'
  //   );
  // }

  if (challengeAllowed && challengeProbability > 0.5) {
    return 'challenge';
  }

  // Generate and evaluate betting options
  const bettingOptions = generateBettingOptions(updatedContext);
  // if (!bettingOptions.length) {
  //   return 'challenge';
  // }

  const evaluatedOptions = bettingOptions.map((option) =>
    // evaluateBettingOption(option, updatedContext, probAnalysis)
    evaluateBettingOption(option, updatedContext)
  );

  // Select best option
  const bestOption = selectBestBettingOption({
    options: evaluatedOptions,
    personality,
    // updatedContext,
    probAnalysis,
    preferredStrategy,
  });

  // Prepare decision for logging
  // const bestOptionData = {
  //   ...bestOption,
  //   expectedValue: roundValue(bestOption.expectedValue),
  // };
  // console.info('makeAdvancedDecision > bestOptionData', bestOptionData);

  return { count: bestOption.count, value: bestOption.value };
};

// Advanced logic entry point
export const getAdvancedDecision = ({
  allDice,
  currentBet,
  gameHistory,
  isBot,
  player,
  players,
  preferredStrategy,
  roundNumber,
}: AdvancedBetParams): Decision => {
  const activePlayerCount = players.filter((p) => p.isActive).length;
  const personality = BOT_PERSONALITIES[preferredStrategy ?? 'conservative'];

  // Get last bettor from history
  const lastBettorId =
    gameHistory.length > 0 ? gameHistory[gameHistory.length - 1].player : 0;

  const context: BettingContext = {
    currentBet,
    myDice: player.dice,
    totalDiceCount: allDice.length,
    roundNumber,
    gameHistory,
    activePlayerCount,
    playerProfiles: new Map(),
    lastBettorId,
  };

  const decision = makeAdvancedDecision({
    personality,
    context,
    isBot,
    preferredStrategy,
  });

  // Fallback to simple bet if challenge not implemented
  if (decision === 'challenge') {
    return 'challenge';
  }

  return decision;
};

export const getValuableDiceNumber = (dice: number[], value: number) => {
  return dice.filter((d) => d === value || d === 1).length;
};
