'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Dice from '@/core/features/dudo/components/dice';
import { Bet, GamePhase, Player } from '@/core/features/dudo/types';
import { Decision } from '@/core/features/dudo/types/advanced-logic';
import { getPremiumDecision } from '@/core/features/dudo/utils/premium-logic';
import { cn } from '@/core/utils/common';
import DiamondIcon from '~/public/icons/ui/diamond.svg';

const HIDE_DELAY = 5000;

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
  const [active, setActive] = useState(false);
  const [data, setData] = useState<{
    decision: Decision | null;
    confidence: number;
  } | null>(null);

  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allowed =
    players.length && isPlayerTurn && gamePhase === 'betting' && currentBet;

  const decision = data?.decision;
  const confidence = data?.confidence ? `${data.confidence}` : null;
  const isChallenge = decision === 'challenge';

  const getDecision = useCallback(() => {
    const premiumDecision = getPremiumDecision({
      allDice,
      currentBet,
      players,
    });
    // console.log('premiumDecision', premiumDecision);

    // const advancedDecision = getAdvancedDecision({
    //   allDice,
    //   currentBet,
    //   gameHistory,
    //   player: players[0],
    //   players,
    //   roundNumber,
    // });
    // // console.info('Advanced decision', advancedDecision);

    return premiumDecision;
  }, [allDice, currentBet, players]);

  useEffect(() => {
    if (!active || !allowed) return;

    const decision = getDecision() ?? null;
    setData(decision);

    if (decision !== null) {
      hideTimeout.current = setTimeout(() => {
        setData(null);
      }, HIDE_DELAY);
    }

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [active, allowed, getDecision]);

  if (!players.length) return null;

  return (
    <div
      className={cn(
        'fixed top-5 z-50',
        allowed && 'opacity-100 pointer-events-auto'
      )}
    >
      <div className="flex-center gap-4">
        <div className="relative flex items-center gap-4">
          {/* Toggle */}
          <div
            className={cn(
              'h-6 w-6 -translate-y-0.5 cursor-pointer transition-all',
              active ? 'text-accent' : 'text-muted opacity-60'
            )}
            onClick={() => setActive((prev) => !prev)}
            title="Pro tips"
          >
            <DiamondIcon />
          </div>

          {/* Bet tooltip */}
          <div
            className={cn(
              'absolute w-30 opacity-0 top-11 left-1/2 -translate-x-1/2 rounded-md bg-card pointer-events-none transition-opacity duration-300',
              active && allowed && decision && 'opacity-100'
            )}
          >
            <div className="relative py-3">
              {isChallenge ? (
                <div className="text-sm text-accent text-center font-bold">
                  Challenge
                </div>
              ) : decision ? (
                <div className="flex-center gap-2 font-bold">
                  <div className="text-xl leading-none">{decision.count}</div>
                  <div className="text-xl">×</div>
                  <Dice size="sm" value={decision.value} />
                </div>
              ) : null}

              {confidence ? (
                <div
                  className="absolute left-0 bottom-0 h-0.75 bg-accent rounded-xs transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                ></div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
