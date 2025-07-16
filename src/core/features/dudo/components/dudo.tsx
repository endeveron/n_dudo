'use client';

import ScreenSizeAlert from '@/core/components/shared/screen-size-alert';
import { Separator } from '@/core/components/ui/separator';
import Assistant from '@/core/features/dudo/components/assistant';
import BettingDisplay from '@/core/features/dudo/components/betting-display';
import DiceRoll from '@/core/features/dudo/components/dice-roll';
import GameControls from '@/core/features/dudo/components/game-controls';
import PlayersDisplay from '@/core/features/dudo/components/players-display';
import StartNewGame from '@/core/features/dudo/components/start-new-game';
import StatisticsDisplay from '@/core/features/dudo/components/statistics-display';
import WinnerDisplay from '@/core/features/dudo/components/winner-display';
import useDudo from '@/core/features/dudo/hooks/use-dudo';

const DudoClient = () => {
  const {
    allDice,
    inputCount,
    inputValue,
    currentBet,
    currentPlayer,
    // gameHistory,
    gamePhase,
    gameMode,
    isPlayerTurn,
    mainPlayerLost,
    players,
    recentChallengeResult,
    recentHistoryResult,
    recentAction,
    // recentPlayer,
    rolling,
    roundNumber,
    totalDiceCount,
    winner,
    challengeBet,
    // countDice,
    handleMakeBet,
    handleStartNewGame,
    // makeBet,
    rollDice,
    setInputCount,
    setInputValue,
  } = useDudo();

  return (
    <div className="dudo_container">
      {/* Game board */}
      {!winner && players.length > 0 && (
        <div className="flex gap-4">
          <div className="dudo_content">
            {/* Header */}
            <PlayersDisplay
              inputValue={inputValue}
              currentPlayer={currentPlayer}
              rolling={rolling}
              players={players}
              recentHistoryResult={recentHistoryResult}
            />

            {/* Main */}
            <div className="dudo_main">
              <div className="dudo_main_column">
                <BettingDisplay
                  currentBet={currentBet}
                  gamePhase={gamePhase}
                  recentAction={recentAction}
                  recentChallengeResult={recentChallengeResult}
                />
                <Separator />
                <StatisticsDisplay totalDiceCount={totalDiceCount} />
              </div>

              <div className="dudo_main_column">
                <DiceRoll
                  rolling={rolling}
                  mainPlayerLost={mainPlayerLost}
                  gamePhase={gamePhase}
                  winner={winner}
                  playerDice={players[0].dice}
                />
              </div>
            </div>

            {/* Footer */}
            <GameControls
              currentBet={currentBet}
              gameMode={gameMode}
              inputCount={inputCount}
              inputValue={inputValue}
              isGameControls={
                isPlayerTurn && gamePhase === 'betting' && !winner
              }
              mainPlayerLost={mainPlayerLost}
              rolling={rolling}
              roundNumber={roundNumber}
              totalDiceCount={totalDiceCount}
              onChallengeBet={challengeBet}
              onDiceCountUpdate={(value: number) => setInputCount(value)}
              onDiceValueUpdate={(value: number) => setInputValue(value)}
              onMakeBet={handleMakeBet}
              onRollDice={rollDice}
              onStartNewGame={handleStartNewGame}
            />
          </div>

          {/* Sidebar */}
          {/* <GameHistory gameHistory={gameHistory} players={players} /> */}
        </div>
      )}

      <StartNewGame players={players} onGameStart={handleStartNewGame} />

      {/* Elevated overlay elements */}

      {/* Winner announcement ( z-30 ) */}
      <WinnerDisplay winner={winner} onStartNewGame={handleStartNewGame} />

      {/* Alert ( z-40 ) */}
      <ScreenSizeAlert />

      {/* Assistant ( z-60 ) */}
      <Assistant
        allDice={allDice}
        currentBet={currentBet}
        gamePhase={gamePhase}
        isPlayerTurn={isPlayerTurn}
        players={players}
      />
    </div>
  );
};

export default DudoClient;
