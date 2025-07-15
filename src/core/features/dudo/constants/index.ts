export const USER_NAME = 'You';

export const HISTORY_LENGTH = 12;

export const BOT_DECISION_TIMEOUT = 500; // 0.5 sec

export const FORCED_CHALLENGE_PROBABILITY = 0.25; // The probability of a forced `challenge` decision for a bot

export const initialPlayers = [
  { id: 0, name: USER_NAME, dice: [], isBot: false, isActive: true },
  { id: 1, name: 'Alice', dice: [], isBot: true, isActive: true },
  { id: 2, name: 'Brian', dice: [], isBot: true, isActive: true },
  { id: 3, name: 'Cindy', dice: [], isBot: true, isActive: true },
  { id: 4, name: 'David', dice: [], isBot: true, isActive: true },
];
