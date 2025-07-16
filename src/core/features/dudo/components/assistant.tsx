'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Dice from '@/core/features/dudo/components/dice';
import { Bet, GamePhase, Player } from '@/core/features/dudo/types';
import { Decision } from '@/core/features/dudo/types/advanced-logic';
import { getPremiumDecision } from '@/core/features/dudo/utils/premium-logic';
import { cn } from '@/core/utils/common';
import DiamondIcon from '~/public/icons/ui/diamond.svg';

// const HIDE_DELAY = 30000;

export interface AssistantProps {
  allDice: number[];
  currentBet: Bet | null;
  gamePhase: GamePhase;
  isPlayerTurn: boolean;
  players: Player[];
}

const Assistant = ({
  allDice,
  currentBet,
  gamePhase,
  isPlayerTurn,
  players,
}: AssistantProps) => {
  const [isActive, setIsActive] = useState(false);
  const [assistantData, setAssistantData] = useState<{
    decision: Decision | null;
    confidence: number;
  } | null>(null);

  const canAssist = useMemo(() => {
    return (
      players.length > 0 &&
      isPlayerTurn &&
      gamePhase === 'betting' &&
      currentBet !== null
    );
  }, [players.length, isPlayerTurn, gamePhase, currentBet]);

  const hasProcessedRequest = assistantData !== null;
  const shouldShowTooltip = canAssist && isActive && hasProcessedRequest;

  const decision = assistantData?.decision ?? null;
  const confidence = assistantData?.confidence ?? 0;
  const confidencePercentage = confidence > 0 ? `${confidence}%` : null;

  const isChallenge = decision === 'challenge';
  const isBet = decision !== null && decision !== 'challenge';
  const cannotHelp = hasProcessedRequest && decision === null;

  const getDecision = useCallback(() => {
    const premiumDecision = getPremiumDecision({
      allDice,
      currentBet,
      players,
    });
    return premiumDecision;
  }, [allDice, currentBet, players]);

  useEffect(() => {
    if (!isActive || !canAssist) {
      setAssistantData(null);
      return;
    }

    const decision = getDecision() ?? null;
    setAssistantData(decision);
  }, [isActive, canAssist, getDecision]);

  // Early return if no players
  if (players.length === 0) return null;

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const renderTooltipContent = () => {
    if (isChallenge) {
      return <span className="relative text-title z-10">Challenge</span>;
    }

    if (isBet && decision) {
      return (
        <div className="relative flex-center gap-2 z-10">
          <div className="text-[28px]">{decision.count}</div>
          <div className="text-xl">×</div>
          <Dice size="md" value={decision.value} />
        </div>
      );
    }

    if (cannotHelp) {
      return <div className="relative text-title z-10">Uncertain</div>;
    }

    return null;
  };

  return (
    <div className="dudo_assistant">
      <div className="flex-center gap-4">
        <div className="relative flex items-center gap-4">
          {/* Toggle */}
          <div
            className={cn(
              'h-6 w-6 -translate-y-0.5 cursor-pointer transition-all',
              isActive ? 'text-title' : 'text-white/40 dark:text-white/30'
            )}
            onClick={handleToggle}
            title="Pro tips"
          >
            <DiamondIcon />
          </div>

          {/* Tooltip */}
          <div
            className={cn(
              'absolute overflow-hidden w-30 h-14 p-0.5 opacity-0 top-11 left-1/2 -translate-x-1/2 rounded-md bg-card pointer-events-none transition-opacity duration-300',
              shouldShowTooltip && 'opacity-100'
            )}
          >
            <div className="relative h-full font-bold leading-none flex-center pb-0.5 z-20">
              {renderTooltipContent()}

              {/* Confidence bar */}
              {confidencePercentage && (
                <div
                  className="absolute left-0 bottom-0 h-0.75 bg-accent rounded-xs transition-all duration-500 z-20"
                  style={{ width: confidencePercentage }}
                />
              )}

              <div className="absolute -inset-0.5 bg-card/50 dark:hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const Assistant = ({
//   allDice,
//   currentBet,
//   gamePhase,
//   isPlayerTurn,
//   players,
// }: AssistantProps) => {
//   const [active, setActive] = useState(false);
//   const [data, setData] = useState<{
//     decision: Decision | null;
//     confidence: number;
//   } | null>(null);

//   // const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const allowed =
//     players.length && isPlayerTurn && gamePhase === 'betting' && currentBet;

//   const decision = data?.decision;
//   const confidence = data?.confidence ? `${data.confidence}` : null;
//   const isChallenge = decision === 'challenge';
//   const showTooltip = allowed && active && data !== null;

//   console.log('data', data);

//   const getDecision = useCallback(() => {
//     const premiumDecision = getPremiumDecision({
//       allDice,
//       currentBet,
//       players,
//     });

//     console.log('premiumDecision', premiumDecision);

//     // const advancedDecision = getAdvancedDecision({
//     //   allDice,
//     //   currentBet,
//     //   gameHistory,
//     //   player: players[0],
//     //   players,
//     //   roundNumber,
//     // });

//     return premiumDecision;
//   }, [allDice, currentBet, players]);

//   useEffect(() => {
//     if (!active || !allowed) return;

//     const decision = getDecision() ?? null;
//     console.log('decision', decision);
//     setData(decision);

//     // if (decision !== null) {
//     //   hideTimeout.current = setTimeout(() => {
//     //   setData(null);
//     //   }, HIDE_DELAY);
//     // }

//     // return () => {
//     //   if (hideTimeout.current) clearTimeout(hideTimeout.current);
//     // };
//   }, [active, allowed, getDecision]);

//   if (!players.length) return null;

//   return (
//     <div className="dudo_assistant">
//       <div className="flex-center gap-4">
//         <div className="relative flex items-center gap-4">
//           {/* Toggle */}
//           <div
//             className={cn(
//               'h-6 w-6 -translate-y-0.5 cursor-pointer transition-all',
//               active ? 'text-title' : 'text-white/40 dark:text-white/30'
//             )}
//             onClick={() => setActive((prev) => !prev)}
//             title="Pro tips"
//           >
//             <DiamondIcon />
//           </div>

//           {/* Bet tooltip */}
//           <div
//             className={cn(
//               'absolute overflow-hidden w-30 h-14 p-0.5 opacity-0 top-11 left-1/2 -translate-x-1/2 rounded-md bg-card pointer-events-none transition-opacity duration-300',
//               showTooltip && 'opacity-100'
//             )}
//           >
//             <div className="relative h-full font-bold leading-none flex-center pb-0.5 z-20">
//               {isChallenge ? (
//                 <span className="relative text-title z-10">Challenge</span>
//               ) : decision ? (
//                 <div className="relative flex-center gap-2 z-10">
//                   <div className="text-[28px]">{decision.count}</div>
//                   <div className="text-xl">×</div>
//                   <Dice size="md" value={decision.value} />
//                 </div>
//               ) : null}

//               {decision === null ? (
//                 // <div className="relative text-title z-10">Can&apos;t help</div>
//                 <div className="relative text-title z-10">No decision</div>
//               ) : null}

//               {confidence ? (
//                 <div
//                   className="absolute left-0 bottom-0 h-0.75 bg-accent rounded-xs transition-all duration-500 z-20"
//                   style={{ width: `${confidence}%` }}
//                 ></div>
//               ) : null}

//               <div className="absolute -inset-0.5 bg-card/50 dark:hidden"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default Assistant;
