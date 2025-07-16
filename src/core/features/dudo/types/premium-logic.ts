import { Bet, Player } from '@/core/features/dudo/types';

export interface PremiumBetParams {
  allDice: number[];
  currentBet: Bet | null;
  players: Player[];
}

export interface GameAnalysis {
  actualCount: number;
  expectedCount: number;
  probability: number;
  isCurrentBetValid: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  allDiceCounts: Map<number, number>;
  totalDice: number;
}
