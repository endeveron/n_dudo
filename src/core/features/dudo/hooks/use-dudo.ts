import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  BOT_DECISION_TIMEOUT,
  initialPlayers,
} from '@/core/features/dudo/constants';
import {
  Bet,
  GameHistoryEntry,
  GameMode,
  GamePhase,
  Player,
} from '@/core/features/dudo/types';
import { Decision } from '@/core/features/dudo/types/advanced-logic';
import { getAdvancedDecision } from '@/core/features/dudo/utils/advanced-logic';
import {
  validateBet,
  validateDice,
} from '@/core/features/dudo/utils/validators';

const useDudo = () => {
  const [gameMode, setGameMode] = useState<GameMode>('blitz');
  const [initialDiceCount, setInitialDiceCount] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('rolling');
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [winner, setWinner] = useState<null | Player>(null);
  const [inputCount, setInputCount] = useState(1);
  const [inputValue, setInputValue] = useState(2);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);

  const currentPlayerData = players[currentPlayer];
  const isPlayerTurn = currentPlayerData && !currentPlayerData.isBot;
  const latestHistoryItem = gameHistory.length ? gameHistory.at(-1) : undefined;
  const recentHistoryResult =
    latestHistoryItem?.action === 'challenge'
      ? latestHistoryItem.result
      : undefined;

  // Auth session data
  // const { session, status } = useSessionWithRefresh();
  // For API calls (not currently in use)
  // const response = await authenticatedFetch('/api/v1/protected-endpoint');

  const resetInput = () => {
    setInputCount(1);
    setInputValue(2);
  };

  // Initialize players
  const initializeGame = useCallback(
    ({
      diceCount,
      playerCount,
      mode,
    }: {
      diceCount: number;
      playerCount: number;
      mode: GameMode;
    }): void => {
      const playerArr = initialPlayers.slice(0, playerCount);
      const extendedPlayers = playerArr.map((data) => ({
        diceCount,
        ...data,
      }));
      setInitialDiceCount(diceCount * playerCount);
      setPlayers(extendedPlayers);
      setGameMode(mode);
      setCurrentPlayer(0);
      setCurrentBet(null);
      setGamePhase('rolling');
      setWinner(null);
      setGameHistory([]);
      setRoundNumber(1);
    },
    []
  );

  const recentChallengeResult = useMemo(() => {
    const lastChallenge = gameHistory
      .slice()
      .reverse()
      .find((h) => h.action === 'challenge');
    return lastChallenge?.result;
  }, [gameHistory]);

  const totalDiceCount = useMemo(() => {
    return players
      .filter((p) => p.isActive)
      .reduce((sum, p) => sum + p.diceCount, 0);
  }, [players]);

  // Get all dice from active players
  const allDice: number[] = useMemo(() => {
    const allDiceFiltered = players
      .filter((p) => p.isActive)
      .flatMap((p) => p.dice);

    validateDice(allDiceFiltered, 'use-dudt.ts > allDice');

    return allDiceFiltered;
  }, [players]);

  const rolling = useMemo(() => {
    return gamePhase === 'rolling' && !winner;
  }, [gamePhase, winner]);

  const mainPlayerLost = useMemo(() => {
    if (!players.length) return false;
    return !players[0].isActive && players.some((p) => p.isActive);
  }, [players]);

  const recentPlayer = useMemo(() => {
    if (!gameHistory.length || !players.length) return null;

    const recentHistoryItem = gameHistory.at(-1);
    if (!recentHistoryItem || recentHistoryItem.action !== 'bet') {
      return null;
    }

    return players[recentHistoryItem.player];
  }, [gameHistory, players]);

  const recentAction = useMemo(() => {
    if (!gameHistory.length || !players.length) return null;

    const recentHistoryItem = gameHistory.at(-1);
    if (!recentHistoryItem) return null;

    const playerName = players[recentHistoryItem.player]?.name;
    if (!playerName) return null;

    const recentAction = recentHistoryItem.action;

    if (recentAction === 'bet') {
      return `${playerName} bet`;
    }

    if (recentHistoryItem.result.betWasCorrect) {
      return `${playerName} lost dice`;
    } else {
      return `${playerName} won`;
    }
  }, [gameHistory, players]);

  // const lostDice = useMemo(() => {
  //   return initialDiceCount - totalDiceCount;
  // }, [totalDiceCount]);

  // Roll dice for all players
  const rollDice = useCallback((): void => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        dice: player.isActive
          ? Array.from(
              { length: player.diceCount },
              () => Math.floor(Math.random() * 6) + 1
            )
          : [],
      }))
    );
    setGamePhase('betting');
  }, []);

  // Count total dice of a specific value (1s are wild)
  const countDice = useCallback(
    (targetValue: number, allDice: number[]): number => {
      return allDice.reduce((count, die) => {
        return count + (die === targetValue || die === 1 ? 1 : 0);
      }, 0);
    },
    []
  );

  // Bot AI for making bets
  const getBotDecision = useCallback(
    (player: Player, currentBet: Bet | null): Decision => {
      const myDice = player.dice;
      const totalDice = allDice.length;

      // Guard against empty dice arrays
      if (myDice.length === 0 || totalDice === 0) {
        // Fallback behavior when no dice available
        const randomValue = Math.floor(Math.random() * 6) + 1;
        return { count: 1, value: randomValue };
      }

      // // Simple AI strategy
      // let bet: Bet;
      // if (!currentBet) {
      //   // First bet - be conservative
      //   const commonValue = myDice.reduce((a, b) =>
      //     myDice.filter((v) => v === a).length >=
      //     myDice.filter((v) => v === b).length
      //       ? a
      //       : b
      //   );
      //   const myCount = myDice.filter(
      //     (d) => d === commonValue || d === 1
      //   ).length;

      //   bet = { count: Math.max(1, myCount), value: commonValue };
      // } else {
      //   // Raise bet based on probability
      //   const probabilityThreshold = 0.3;
      //   const expectedCount = Math.floor(totalDice * probabilityThreshold);

      //   if (currentBet.count < expectedCount) {
      //     bet = { count: currentBet.count + 1, value: currentBet.value };
      //   } else if (currentBet.value < 6) {
      //     bet = { count: currentBet.count, value: currentBet.value + 1 };
      //   } else {
      //     bet = { count: currentBet.count + 1, value: 2 };
      //   }
      // }
      // console.info('Simple decision', bet);

      // Advanced AI strategy
      const botDecision = getAdvancedDecision({
        allDice,
        currentBet,
        gameHistory,
        initialDiceCount,
        player,
        players,
        roundNumber,
        isBot: !isPlayerTurn,
      });

      return botDecision;
    },
    [allDice, gameHistory, initialDiceCount, isPlayerTurn, players, roundNumber]
  );

  // Helper function to find next active player
  const findNextActivePlayer = useCallback(
    (startFromPlayer: number): number => {
      const activePlayers = players.filter((p) => p.isActive);
      if (activePlayers.length === 0) return 0;

      let nextPlayer = startFromPlayer;
      let attempts = 0;
      const maxAttempts = players.length;

      while (attempts < maxAttempts) {
        if (players[nextPlayer]?.isActive) {
          return nextPlayer;
        }
        nextPlayer = (nextPlayer + 1) % players.length;
        attempts++;
      }

      // Fallback to first active player
      return activePlayers[0].id;
    },
    [players]
  );

  // Make a bet
  const makeBet = useCallback(
    (newBet: Bet): boolean => {
      // Base validation
      const isValid = validateBet({
        bet: { count: inputCount, value: inputValue },
        // totalDiceCount,
        errMsg: 'use.dudo.ts > makeBet: Invalid bet',
      });

      if (!isValid) return false;

      if (
        currentBet &&
        newBet.count <= currentBet.count &&
        newBet.value <= currentBet.value
      ) {
        const toastMsg = `Increase dice count ( ${
          currentBet.count === totalDiceCount - 1
            ? totalDiceCount - 1
            : `${currentBet.count + 1}  - ${totalDiceCount}`
        } ) or face ( ${
          currentBet.value === 5
            ? '6 pips'
            : `${currentBet.value + 1} - 6 pips `
        } )`;
        toast(toastMsg, {
          duration: 4000,
        });

        return false;
      }

      setCurrentBet({ count: newBet.count, value: newBet.value });
      setGameHistory((prev) => [
        ...prev,
        { player: currentPlayer, bet: newBet, action: 'bet' },
      ]);

      // Move to next active player using helper function
      const nextPlayer = findNextActivePlayer(
        (currentPlayer + 1) % players.length
      );
      setCurrentPlayer(nextPlayer);

      return true;
    },
    [
      inputCount,
      inputValue,
      totalDiceCount,
      currentBet,
      findNextActivePlayer,
      currentPlayer,
      players.length,
    ]
  );

  // Challenge the current bet
  const challengeBet = useCallback((): void => {
    if (!currentBet) {
      console.error('use-dudo.ts > challengeBet: Invalid `currentBet`');
      return;
    }
    const actualCount = countDice(currentBet.value, allDice);
    const betWasCorrect = actualCount >= currentBet.count;

    const challenger = currentPlayer;
    const bettor = gameHistory[gameHistory.length - 1]?.player ?? 0;

    setGameHistory((prev) => [
      ...prev,
      {
        player: challenger,
        action: 'challenge',
        result: { betWasCorrect, actualCount, bettor, challenger },
      },
    ]);

    // Determine who loses a die
    const loser = betWasCorrect ? challenger : bettor;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.id === loser) {
          const newDiceCount = player.diceCount - 1;
          return {
            ...player,
            diceCount: newDiceCount,
            isActive: newDiceCount > 0,
          };
        }
        return player;
      })
    );

    // Check for winner after updating players
    setTimeout(() => {
      const updatedActivePlayers = players.filter(
        (p) => p.isActive && (p.id !== loser || p.diceCount > 1)
      );

      if (updatedActivePlayers.length === 1) {
        setWinner(updatedActivePlayers[0]);
        setGamePhase('gameOver');
      } else {
        setGamePhase('rolling');
        setCurrentBet(null);

        // Set next player - if loser is still active, they go first, otherwise find next active
        const nextActivePlayer = players.find(
          (p) => p.id === loser && p.diceCount > 1
        )
          ? loser
          : findNextActivePlayer(loser);

        setCurrentPlayer(nextActivePlayer);
        setRoundNumber((prev) => prev + 1);
      }
    }, 0);
  }, [
    currentBet,
    currentPlayer,
    gameHistory,
    players,
    allDice,
    countDice,
    findNextActivePlayer,
  ]);

  // Bot turn logic
  useEffect(() => {
    if (gamePhase === 'betting' && players[currentPlayer]?.isBot && !winner) {
      const timer = setTimeout(() => {
        const player = players[currentPlayer];

        // Additional safety check - don't proceed if player is inactive
        if (!player?.isActive) {
          // If current player is inactive, find next active player
          const nextActivePlayer = findNextActivePlayer(
            (currentPlayer + 1) % players.length
          );
          setCurrentPlayer(nextActivePlayer);
          return;
        }

        const botDecision = getBotDecision(player, currentBet);

        if (botDecision === 'challenge') {
          challengeBet();
        } else {
          makeBet(botDecision);
        }
      }, BOT_DECISION_TIMEOUT);

      return () => clearTimeout(timer);
    }

    // Handle case where current player is inactive (human or bot)
    if (
      gamePhase === 'betting' &&
      !players[currentPlayer]?.isActive &&
      !winner
    ) {
      const nextActivePlayer = findNextActivePlayer(
        (currentPlayer + 1) % players.length
      );
      setCurrentPlayer(nextActivePlayer);
    }
  }, [
    gamePhase,
    currentPlayer,
    players,
    currentBet,
    winner,
    challengeBet,
    makeBet,
    allDice,
    findNextActivePlayer,
    getBotDecision,
  ]);

  const handleMakeBet = () => {
    const isBetMade = makeBet({ count: inputCount, value: inputValue });
    if (isBetMade) {
      resetInput();
    }
  };

  const handleStartNewGame = (mode: GameMode = 'standart') => {
    resetInput();

    switch (mode) {
      case 'blitz':
        initializeGame({ diceCount: 3, playerCount: 3, mode });
        break;
      case 'rapid':
        initializeGame({ diceCount: 5, playerCount: 3, mode });
        break;
      default:
        initializeGame({ diceCount: 5, playerCount: 5, mode });
    }

    rollDice();
  };

  useEffect(() => {
    if (!currentBet) return;
    setInputCount(currentBet.count);
    setInputValue(currentBet.value);
  }, [currentBet]);

  useEffect(() => {
    if (!roundNumber || gamePhase !== 'betting') return;
    resetInput();
  }, [gamePhase, roundNumber]);

  return {
    allDice,
    inputCount,
    inputValue,
    currentBet,
    currentPlayer,
    gameHistory,
    gameMode,
    gamePhase,
    isPlayerTurn,
    mainPlayerLost,
    players,
    recentAction,
    recentChallengeResult,
    recentHistoryResult,
    recentPlayer,
    rolling,
    roundNumber,
    totalDiceCount,
    winner,
    challengeBet,
    countDice,
    handleMakeBet,
    handleStartNewGame,
    initializeGame,
    makeBet,
    rollDice,
    setInputCount,
    setInputValue,
  };
};

export default useDudo;
