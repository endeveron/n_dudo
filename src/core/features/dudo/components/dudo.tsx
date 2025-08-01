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
import PremiumDialog from '@/core/features/premium/components/premium-dialog';
import { BILLING_URL } from '@/core/features/premium/constants';
import { usePremium } from '@/core/features/premium/context';

const DudoClient = () => {
  const {
    allDice,
    email,
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
    rollDice,
    setInputCount,
    setInputValue,
    startNewGame,
  } = useDudo();
  const { isPremiumDialog, setIsPremiumDialog } = usePremium();

  return (
    <div className="h-full">
      <div className="dudo_container">
        {isPremiumDialog && (
          <PremiumDialog
            email={email}
            billingUrl={BILLING_URL}
            title="Premium Bet Tips"
            description="Only $5 for unlimited betting tips"
            onClose={() => setIsPremiumDialog(false)}
          />
        )}

        {!isPremiumDialog && (
          <>
            {isGameBoard && (
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
                    onStartNewGame={startNewGame}
                  />
                </div>

                {/* <GameHistory gameHistory={gameHistory} players={players} /> */}
              </AnimatedAppear>
            )}
            <StartNewGame players={players} onStartNewGame={startNewGame} />
            <WinnerDisplay winner={winner} onStartNewGame={startNewGame} />
          </>
        )}

        {/* Alert z-40 */}
        <ScreenSizeAlert />

        {/* Topbar z-50 */}

        {/* Assistant z-60 */}
        <Assistant
          allDice={allDice}
          currentBet={currentBet}
          gamePhase={gamePhase}
          isPlayerTurn={isPlayerTurn}
          players={players}
        />
      </div>
    </div>
  );
};

export default DudoClient;
