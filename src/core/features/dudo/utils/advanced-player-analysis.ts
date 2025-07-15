import { PlayerProfile } from '@/core/features/dudo/types/advanced-logic';
import { Bet, GameHistoryEntry } from '@/core/features/dudo/types';

export const updatePlayerProfile = (
  currentProfile: PlayerProfile | null,
  gameHistory: GameHistoryEntry[],
  playerId: number
): PlayerProfile => {
  const defaultProfile: PlayerProfile = {
    id: playerId,
    avgBetIncrease: 1,
    bluffRate: 0.3,
    challengeAccuracy: 0.5,
    aggressionHistory: [],
    recentBehavior: 'conservative',
  };

  if (!currentProfile) {
    currentProfile = defaultProfile;
  }

  // Analyze recent actions (last 10 entries)
  const recentActions = gameHistory
    .slice(-10)
    .filter((entry) => entry.player === playerId);

  const bets = recentActions.filter((action) => action.action === 'bet');
  const challenges = recentActions.filter(
    (action) => action.action === 'challenge'
  );

  // Calculate average bet increase
  const betIncreases = bets.slice(1).map((bet, i) => {
    const prevBet = bets[i];
    return (bet.bet?.count || 0) - (prevBet.bet?.count || 0);
  });

  const avgBetIncrease =
    betIncreases.length > 0
      ? betIncreases.reduce((sum, inc) => sum + inc, 0) / betIncreases.length
      : currentProfile.avgBetIncrease;

  // Calculate bluff rate from failed challenges
  const failedChallenges = challenges.filter(
    (c) => c.result?.betWasCorrect === true
  ).length;
  const bluffRate =
    challenges.length > 0
      ? failedChallenges / challenges.length
      : currentProfile.bluffRate;

  // Calculate challenge accuracy
  const successfulChallenges = challenges.filter(
    (c) => c.result?.betWasCorrect === false
  ).length;
  const challengeAccuracy =
    challenges.length > 0
      ? successfulChallenges / challenges.length
      : currentProfile.challengeAccuracy;

  // Determine recent behavior
  const recentAggression =
    bets.length > 0
      ? bets.reduce((sum, bet) => sum + (bet.bet?.count || 0), 0) / bets.length
      : 2;

  const recentBehavior: PlayerProfile['recentBehavior'] =
    recentAggression > 4
      ? 'aggressive'
      : recentAggression < 2
      ? 'conservative'
      : 'unpredictable';

  return {
    ...currentProfile,
    avgBetIncrease,
    bluffRate,
    challengeAccuracy,
    aggressionHistory: [
      ...currentProfile.aggressionHistory.slice(-5),
      recentAggression,
    ],
    recentBehavior,
  };
};

export const calculateSuspicionLevel = (
  profile: PlayerProfile | null,
  currentBet: Bet | null,
  totalDiceCount: number
): number => {
  // If we don't have a profile, we can't make any judgment about the player.
  // So, we return neutral suspicion: 0.5 (on a scale from 0 to 1).
  // This means: “I have no reason to trust or doubt this player.”
  if (!profile) return 0.5; // Be neutral

  // If there's no current bet, there's no basis for suspicion.
  // For example, it's likely the first turn, or the player hasn’t bet yet.
  // In this case:
  // - There’s no bluffing yet.
  // - There’s nothing aggressive or unusual happening.
  // - So, a low suspicion level like 0.2 makes sense.
  if (!currentBet) return 0.2; // There's nothing suspicious

  let suspicion = 0;

  // High bet relative to total dice
  if (currentBet.count > totalDiceCount * 0.4) {
    suspicion += 0.3;
  }

  // Player's historical bluff rate
  suspicion += profile.bluffRate * 0.4;

  // Unusual betting pattern
  if (
    profile.recentBehavior === 'aggressive' &&
    currentBet.count > profile.avgBetIncrease * 2
  ) {
    suspicion += 0.3;
  }

  return Math.min(1, Math.max(0, suspicion));
};
