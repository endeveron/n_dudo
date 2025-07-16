export type GameMode = 'standart' | 'rapid' | 'blitz';
export type GamePhase = 'rolling' | 'betting' | 'challenging' | 'gameOver';

export type Player = {
  dice: number[];
  diceCount: number;
  id: number;
  isActive: boolean;
  isBot: boolean;
  name: string;
};

export type Bet = {
  count: number;
  value: number;
};

export type RecentHistoryResult = {
  betWasCorrect: boolean;
  actualCount: number;
  bettor: number;
  challenger: number;
};

export type GameHistoryEntry =
  | { player: number; bet: Bet; action: 'bet' }
  | {
      player: number;
      action: 'challenge';
      result: {
        betWasCorrect: boolean;
        actualCount: number;
        bettor: number;
        challenger: number;
      };
    };
