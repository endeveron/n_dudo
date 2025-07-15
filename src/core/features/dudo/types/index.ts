export type GameMode = 'standart' | 'rapid' | 'blitz';
export type GamePhase = 'rolling' | 'betting' | 'challenging' | 'gameOver';

export type Player = {
  id: number;
  name: string;
  dice: number[];
  diceCount: number;
  isBot: boolean;
  isActive: boolean;
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
