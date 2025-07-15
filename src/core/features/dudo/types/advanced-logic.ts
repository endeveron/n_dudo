import { STRATEGIES } from '@/core/features/dudo/constants/advanced-bot-personalities';
import { Bet, GameHistoryEntry, Player } from '@/core/features/dudo/types';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type Strategy = (typeof STRATEGIES)[number];

export interface BotPersonality {
  // name: string;
  aggressionLevel: number; // 0-1
  riskTolerance: number; // 0-1
  bluffTendency: number; // 0-1
  analyticalDepth: number; // 0-1
  challengeThreshold: number; // 0-1
}

export interface PlayerProfile {
  id: number;
  avgBetIncrease: number;
  bluffRate: number;
  challengeAccuracy: number;
  aggressionHistory: number[];
  recentBehavior: 'conservative' | 'aggressive' | 'unpredictable';
}

export interface BettingContext {
  currentBet: Bet | null;
  myDice: number[];
  totalDiceCount: number;
  roundNumber: number;
  gameHistory: GameHistoryEntry[];
  activePlayerCount: number;
  playerProfiles: Map<number, PlayerProfile>;
  lastBettorId: number;
}

export interface ProbabilityAnalysis {
  myCount: number;
  expectedTotal: number;
  actualProbability: number;
  confidenceLevel: number;
}

export interface BehaviorAnalysis {
  suspicionLevel: number;
  lastBettorProfile: PlayerProfile | null;
  recentBluffRate: number;
  bettingAggression: number;
}

export interface GameStateAnalysis {
  gameProgression: number;
  eliminationPressure: number;
  diceScarcity: number;
  urgencyLevel: number;
}

export interface BettingOption {
  count: number;
  value: number;
  type: Strategy;
  riskTolerance: number;
  expectedValue: number;
}

export type Decision = Bet | 'challenge';

export interface AdvancedBetParams {
  allDice: number[];
  currentBet: Bet | null;
  gameHistory: GameHistoryEntry[];
  player: Player;
  players: Player[];
  roundNumber: number;
  preferredStrategy?: Strategy;
  isBot?: boolean;
}
