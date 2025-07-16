import { STRATEGIES } from '@/core/features/dudo/constants/advanced-bot-personalities';
import { Bet, GameHistoryEntry, Player } from '@/core/features/dudo/types';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type Strategy = (typeof STRATEGIES)[number];

export interface BotPersonality {
  riskTolerance: number; // 0-1: willingness to take risks
  aggressionLevel: number; // 0-1: tendency to make aggressive bets
  analyticalDepth: number; // 0-1: depth of analysis before decision
  bluffTendency: number; // 0-1: likelihood to bluff
  challengeThreshold: number; // 0-1: readiness to challenge others
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
  activePlayerCount: number;
  currentBet: Bet | null;
  gameHistory: GameHistoryEntry[];
  initialDiceCount: number;
  lastBettorId: number;
  myDice: number[];
  playerProfiles: Map<number, PlayerProfile>;
  roundNumber: number;
  totalDiceCount: number;
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
  initialDiceCount: number;
  player: Player;
  players: Player[];
  roundNumber: number;
  isBot?: boolean;
}
