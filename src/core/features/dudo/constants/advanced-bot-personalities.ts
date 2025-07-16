import { BotPersonality } from '@/core/features/dudo/types/advanced-logic';

export const STRATEGIES = [
  'conservative',
  'aggressive',
  'analytical',
  'bluffer',
] as const;

export const BOT_PERSONALITIES: Record<string, BotPersonality> = {
  conservative: {
    riskTolerance: 0.25, // Low risk tolerance
    aggressionLevel: 0.15, // Very low aggression
    analyticalDepth: 0.8, // High analysis (thinks carefully)
    bluffTendency: 0.1, // Rarely bluffs
    challengeThreshold: 0.7, // High threshold (challenges only when very confident)
  },

  analytical: {
    riskTolerance: 0.55, // Moderate-high risk tolerance
    aggressionLevel: 0.45, // Moderate aggression
    analyticalDepth: 0.9, // Highest analysis
    bluffTendency: 0.25, // Occasional strategic bluffs
    challengeThreshold: 0.6, // Moderate threshold (calculated challenges)
  },

  aggressive: {
    riskTolerance: 0.8, // High risk tolerance
    aggressionLevel: 0.85, // Very high aggression
    analyticalDepth: 0.4, // Lower analysis (acts on instinct)
    bluffTendency: 0.6, // Frequent bluffs
    challengeThreshold: 0.45, // Lower threshold (challenges more often)
  },

  bluffer: {
    riskTolerance: 0.7, // High risk tolerance
    aggressionLevel: 0.6, // Moderate-high aggression
    analyticalDepth: 0.3, // Low analysis (relies on psychology)
    bluffTendency: 0.8, // Very high bluff tendency
    challengeThreshold: 0.5, // Moderate threshold (balanced challenges)
  },

  cautious: {
    riskTolerance: 0.2, // Very low risk tolerance
    aggressionLevel: 0.3, // Low aggression
    analyticalDepth: 0.75, // High analysis
    bluffTendency: 0.05, // Almost never bluffs
    challengeThreshold: 0.8, // Very high threshold
  },

  gambler: {
    riskTolerance: 0.9, // Very high risk tolerance
    aggressionLevel: 0.7, // High aggression
    analyticalDepth: 0.2, // Low analysis (impulsive)
    bluffTendency: 0.4, // Moderate bluffing
    challengeThreshold: 0.3, // Low threshold (frequent challenges)
  },

  adaptive: {
    riskTolerance: 0.5, // Balanced risk tolerance
    aggressionLevel: 0.5, // Balanced aggression
    analyticalDepth: 0.7, // Good analysis
    bluffTendency: 0.3, // Situational bluffing
    challengeThreshold: 0.55, // Balanced threshold
  },

  wildcard: {
    riskTolerance: 0.6, // Moderate-high risk tolerance
    aggressionLevel: 0.4, // Moderate aggression
    analyticalDepth: 0.5, // Moderate analysis
    bluffTendency: 0.5, // Unpredictable bluffing
    challengeThreshold: 0.4, // Lower threshold for surprises
  },
};

// PREV
//   conservative: {
//     aggressionLevel: 0.2,
//     riskTolerance: 0.4,
//     bluffTendency: 0.1,
//     analyticalDepth: 0.6,
//     challengeThreshold: 0.4,
//   },
//   aggressive: {
//     aggressionLevel: 0.8,
//     riskTolerance: 0.7,
//     bluffTendency: 0.4,
//     analyticalDepth: 0.4,
//     challengeThreshold: 0.7,
//   },
//   analytical: {
//     aggressionLevel: 0.4,
//     riskTolerance: 0.5,
//     bluffTendency: 0.2,
//     analyticalDepth: 0.9,
//     challengeThreshold: 0.3,
//   },
//   bluffer: {
//     aggressionLevel: 0.6,
//     riskTolerance: 0.8, // 0.6
//     bluffTendency: 0.7,
//     analyticalDepth: 0.3,
//     challengeThreshold: 0.5,
//   }
