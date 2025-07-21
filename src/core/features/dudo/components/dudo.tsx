'use client';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import { Card } from '@/core/components/shared/card';
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
    gameMode,
    gamePhase,
    isGameBoard,
    isMainPlayerLost,
    isPlayerTurn,
    isRolling,
    players,
    recentAction,
    recentChallengeResult,
    recentHistoryResult,
    roundNumber,
    totalDiceCount,
    winner,
    challengeBet,
    handleMakeBet,
    handleStartNewGame,
    rollDice,
    setInputCount,
    setInputValue,
  } = useDudo();

  return (
    <div className="dudo_container">
      {isGameBoard && (
        <>
          {/* Backdrop */}
          <AnimatedAppear className="fixed inset-0 backdrop-blur-xl" />

          {/* Game board */}
          <AnimatedAppear className="relative flex gap-4">
            <div className="dudo_content">
              <PlayersDisplay
                inputValue={inputValue}
                currentPlayer={currentPlayer}
                isRolling={isRolling}
                players={players}
                recentHistoryResult={recentHistoryResult}
              />

              <div className="dudo_main">
                <Card className="dudo_main_column">
                  <BettingDisplay
                    currentBet={currentBet}
                    gamePhase={gamePhase}
                    recentAction={recentAction}
                    recentChallengeResult={recentChallengeResult}
                  />
                  <Separator />
                  <StatisticsDisplay totalDiceCount={totalDiceCount} />
                </Card>

                <Card className="dudo_main_column">
                  <DiceRoll
                    isRolling={isRolling}
                    isMainPlayerLost={isMainPlayerLost}
                    gamePhase={gamePhase}
                    winner={winner}
                    playerDice={players[0].dice}
                  />
                </Card>
              </div>

              <GameControls
                currentBet={currentBet}
                gameMode={gameMode}
                inputCount={inputCount}
                inputValue={inputValue}
                isGameControls={
                  isPlayerTurn && gamePhase === 'betting' && !winner
                }
                isMainPlayerLost={isMainPlayerLost}
                isRolling={isRolling}
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

            {/* <GameHistory gameHistory={gameHistory} players={players} /> */}
          </AnimatedAppear>
        </>
      )}

      <StartNewGame players={players} onStartNewGame={handleStartNewGame} />

      {/* Elevated overlay elements */}

      {/* Winner announcement z-30 */}
      <WinnerDisplay winner={winner} onStartNewGame={handleStartNewGame} />

      {/* Alert z-40 */}
      <ScreenSizeAlert />

      {/* Topbar: z-50 */}

      {/* Assistant z-60 */}
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
