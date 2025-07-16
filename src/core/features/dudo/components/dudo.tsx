'use client';

import ScreenSizeAlert from '@/core/components/shared/screen-size-alert';
import { Card, CardContent } from '@/core/components/ui/card';
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
    // roundNumber,
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
    <div className="dudo-container">
      {/* Game board */}
      {players.length > 0 && (
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <PlayersDisplay
              inputValue={inputValue}
              currentPlayer={currentPlayer}
              rolling={rolling}
              players={players}
              recentHistoryResult={recentHistoryResult}
            />

            {/* Main */}
            <div className="flex gap-4">
              {/* Left side block */}
              <Card className="flex-1">
                <CardContent className="pt-4 flex-center flex-1 flex-col">
                  <BettingDisplay
                    className="h-24"
                    currentBet={currentBet}
                    gamePhase={gamePhase}
                    recentAction={recentAction}
                    recentChallengeResult={recentChallengeResult}
                  />

                  <Separator className="my-2" />

                  <StatisticsDisplay
                    className="h-10"
                    totalDiceCount={totalDiceCount}
                  />
                </CardContent>
              </Card>

              {/* Right side block */}
              <Card className="flex flex-col flex-1">
                <CardContent className="pb-0 flex-1 flex-center flex-col">
                  <DiceRoll
                    rolling={rolling}
                    mainPlayerLost={mainPlayerLost}
                    gamePhase={gamePhase}
                    winner={winner}
                    playerDice={players[0].dice}
                    gameMode={gameMode}
                    onRollDice={rollDice}
                    onStartNewGame={handleStartNewGame}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <GameControls
              inputCount={inputCount}
              inputValue={inputValue}
              currentBet={currentBet}
              isGameControls={
                isPlayerTurn && gamePhase === 'betting' && !winner
              }
              totalDiceCount={totalDiceCount}
              onDiceCountUpdate={(value: number) => setInputCount(value)}
              onDiceValueUpdate={(value: number) => setInputValue(value)}
              onMakeBet={handleMakeBet}
              onChallengeBet={challengeBet}
            />
          </div>

          {/* Sidebar */}
          {/* <GameHistory gameHistory={gameHistory} players={players} /> */}
        </div>
      )}

      <StartNewGame players={players} onGameStart={handleStartNewGame} />

      {/* Elevated overlay elements */}

      {/* Assistant ( z-20 ) */}
      <Assistant
        allDice={allDice}
        currentBet={currentBet}
        gamePhase={gamePhase}
        isPlayerTurn={isPlayerTurn}
        players={players}
      />

      {/* Winner announcement ( z-30 ) */}
      <WinnerDisplay winner={winner} onStartNewGame={handleStartNewGame} />

      {/* Small screen size alert ( z-40 ). Opens for screen w < 640px h < 512px */}
      <ScreenSizeAlert />
    </div>
  );
};

export default DudoClient;
