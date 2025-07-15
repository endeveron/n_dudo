import { BotPersonality } from '@/core/features/dudo/types/advanced-logic';

export const STRATEGIES = [
  'conservative',
  'aggressive',
  'analytical',
  'bluffer',
] as const;

export const BOT_PERSONALITIES: Record<string, BotPersonality> = {
  conservative: {
    aggressionLevel: 0.2,
    riskTolerance: 0.4,
    bluffTendency: 0.1,
    analyticalDepth: 0.6,
    challengeThreshold: 0.4,
  },
  aggressive: {
    aggressionLevel: 0.8,
    riskTolerance: 0.7,
    bluffTendency: 0.4,
    analyticalDepth: 0.4,
    challengeThreshold: 0.7,
  },
  analytical: {
    aggressionLevel: 0.4,
    riskTolerance: 0.5,
    bluffTendency: 0.2,
    analyticalDepth: 0.9,
    challengeThreshold: 0.3,
  },
  bluffer: {
    aggressionLevel: 0.6,
    riskTolerance: 0.8, // 0.6
    bluffTendency: 0.7,
    analyticalDepth: 0.3,
    challengeThreshold: 0.5,
  },
} as const;
