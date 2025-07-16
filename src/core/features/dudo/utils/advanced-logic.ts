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
} from '@/core/features/dudo/types/advanced-logic';
import { getValuableDiceNumber } from '@/core/features/dudo/utils';
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

  // Base challenge probability from personality.
  // Sets each bot's default tendency to challenge based on personality,
  // enabling behavior that reflects traits like paranoia or trust.
  challengeProb += personality.challengeThreshold * 0.5;

  // Sanity check: if we already have enough dice, don't challenge
  if (probAnalysis.myCount >= probAnalysis.expectedTotal * 0.8) {
    challengeProb *= 0.1; // Drammatically reduce challenge probability
  }

  // Probability-based challenge (sigmoid-based logic)
  const probabilityWeight = (p: number): number => {
    const k = 6;
    return 1 / (1 + Math.exp(-k * (p - 0.5)));
  };

  const probWeight = probabilityWeight(probAnalysis.actualProbability);

  // Integrate confidence into weight scaling (more confidence = more influence)
  challengeProb += probWeight * (0.3 + probAnalysis.confidenceLevel * 0.2);

  // Behavior-based challenge
  challengeProb += behaviorAnalysis.suspicionLevel * 0.4;

  // Game state adjustments
  challengeProb += gameStateAnalysis.urgencyLevel * 0.2;

  // Decrease `challengeProb` based on bot analytical depth modifier
  challengeProb *= 0.5 + personality.analyticalDepth * 0.5;

  // Apply the probability coefficient for correction
  challengeProb *= challengeProbCoefficient;

  // Clamp final value to [0, 1]
  return Math.max(0, Math.min(1, challengeProb));
};

export const selectBestBettingOption = ({
  options,
  personality,
  probAnalysis,
}: {
  options: BettingOption[];
  personality: BotPersonality;
  // context: BettingContext;
  probAnalysis: ProbabilityAnalysis;
}): BettingOption => {
  let bestOption = options[0];
  let bestScore = -Infinity;

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

    // The risk tolerance adjustment is essentially a personality-based
    // penalty system that makes bots behave authentically according to
    // their character traits.
    // The key insight is that it's not just about finding the
    // mathematically optimal move - it's about finding the move that
    // feels right for that particular bot's personality.
    score -= option.riskTolerance * (1 - personality.riskTolerance) * 0.3;

    // Calculate a bonus based on contribution ratio and confidence level
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

  return bestOption;
};

// Bot decision entry point
export const makeAdvancedDecision = ({
  context,
  isBot,
  personality,
}: {
  context: BettingContext;
  isBot?: boolean;
  personality: BotPersonality;
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

  const { currentBet, myDice, initialDiceCount, totalDiceCount } = context;
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

      // Forced challenges increase as the game becomes more desperate.
      if (isBot) {
        const gameProgression = calculateGameProgression({
          initialDiceCount,
          totalDiceCount,
        });
        if (Math.random() < Math.max(0.02, 0.15 - gameProgression * 0.1)) {
          return 'challenge';
        }
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
  });

  // // Prepare decision for logging
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
  initialDiceCount,
  isBot,
  player,
  players,
  roundNumber,
}: AdvancedBetParams): Decision => {
  const activePlayerCount = players.filter((p) => p.isActive).length;

  // Get last bettor from history
  const lastBettorId =
    gameHistory.length > 0 ? gameHistory[gameHistory.length - 1].player : 0;

  const context: BettingContext = {
    activePlayerCount,
    currentBet,
    gameHistory,
    initialDiceCount,
    lastBettorId,
    myDice: player.dice,
    playerProfiles: new Map(),
    roundNumber,
    totalDiceCount: allDice.length,
  };

  // const personality = BOT_PERSONALITIES.analytical;

  const personality = selectBotPersonality(player.id, {
    roundNumber: context.roundNumber,
    totalDiceCount: context.totalDiceCount,
    activePlayerCount: context.activePlayerCount,
  });

  const decision = makeAdvancedDecision({
    personality,
    context,
    isBot,
  });

  // Fallback to simple bet if challenge not implemented
  if (decision === 'challenge') {
    return 'challenge';
  }

  return decision;
};

// Helper function to randomly select a personality for variety
export const getRandomPersonality = (): BotPersonality => {
  const personalities = Object.values(BOT_PERSONALITIES);
  return personalities[Math.floor(Math.random() * personalities.length)];
};

// Helper function to create dynamic personalities based on game state
export const createDynamicPersonality = (
  basePersonality: string,
  gameState: {
    roundNumber: number;
    totalDiceCount: number;
    activePlayerCount: number;
  }
): BotPersonality => {
  const base = BOT_PERSONALITIES[basePersonality];
  const desperation = Math.min(1, gameState.roundNumber / 15);
  const pressure = Math.max(0, (5 - gameState.activePlayerCount) / 4);

  return {
    ...base,
    aggressionLevel: Math.min(1, base.aggressionLevel + desperation * 0.2),
    riskTolerance: Math.min(1, base.riskTolerance + pressure * 0.15),
    challengeThreshold: Math.max(
      0,
      base.challengeThreshold - desperation * 0.1
    ),
  };
};

// Personality selection strategy
export const selectBotPersonality = (
  playerId: number,
  gameState: {
    roundNumber: number;
    totalDiceCount: number;
    activePlayerCount: number;
  }
): BotPersonality => {
  // Assign consistent personalities based on player ID
  const personalityNames = Object.keys(BOT_PERSONALITIES);
  const basePersonalityName =
    personalityNames[playerId % personalityNames.length];

  // Apply dynamic adjustments based on game state
  return createDynamicPersonality(basePersonalityName, gameState);
};

export const calculateGameProgression = ({
  totalDiceCount,
  initialDiceCount = 25,
}: {
  totalDiceCount: number;
  initialDiceCount: number;
}) => {
  return Math.min(1, (initialDiceCount - totalDiceCount) / initialDiceCount);
};
