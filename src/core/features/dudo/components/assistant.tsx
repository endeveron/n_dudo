'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Dice from '@/core/features/dudo/components/dice';
import {
  AdvancedBetParams,
  Decision,
  Strategy,
} from '@/core/features/dudo/types/advanced-logic';
import { getAdvancedDecision } from '@/core/features/dudo/utils/advanced-logic';
import { cn } from '@/core/utils/common';
import { GamePhase } from '@/core/features/dudo/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { STRATEGIES } from '@/core/features/dudo/constants/advanced-bot-personalities';
import { Switch } from '@/core/components/ui/switch';

const HIDE_DELAY = 5000;

const Assistant = ({
  allDice,
  currentBet,
  gameHistory,
  gamePhase,
  isPlayerTurn,
  players,
  roundNumber,
}: Omit<AdvancedBetParams, 'strategy'> & {
  gamePhase: GamePhase;
  isPlayerTurn: boolean;
}) => {
  const [active, setActive] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [strategy, setStrategy] = useState<Strategy | ''>('');

  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allowed =
    players.length && isPlayerTurn && gamePhase === 'betting' && currentBet;

  const handleChangeStrategy = (value: string) => {
    setStrategy(value as Strategy);
  };

  const getAssist = useCallback(() => {
    const advancedDecision = getAdvancedDecision({
      allDice,
      currentBet,
      gameHistory,
      player: players[0],
      players,
      roundNumber,
      preferredStrategy: strategy === '' ? undefined : strategy, // '' should be used as default value for <Select value={''}>
    });

    // console.info('Advanced decision', advancedDecision);

    return advancedDecision;
  }, [allDice, currentBet, gameHistory, players, roundNumber, strategy]);

  useEffect(() => {
    if (!active || !allowed) return;

    const assist = getAssist() ?? null;
    setDecision(assist);

    if (assist !== null) {
      hideTimeout.current = setTimeout(() => {
        setDecision(null);
      }, HIDE_DELAY);
    }

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [active, allowed, getAssist]);

  if (!players.length) return null;

  return (
    <div
      className={cn(
        'fixed top-[10px] -translate-x-12 z-50',
        allowed && 'opacity-100 pointer-events-auto'
      )}
    >
      <div className="flex-center gap-4">
        {/* <div
          className={cn('font-bold', active ? 'text-accent' : 'text-muted/60')}
        >
          Tips
        </div> */}
        <Switch checked={active} onClick={() => setActive((prev) => !prev)} />

        <div className="relative flex items-center gap-4">
          <Select
            value={strategy}
            onValueChange={handleChangeStrategy}
            disabled={!active}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Bet assistant" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bet tip */}
          <div
            className={cn(
              'absolute opacity-0 h-12 w-36 left-1/2 top-14 -translate-x-1/2 flex-center rounded-md bg-card pointer-events-none transition-opacity duration-300',
              active && allowed && decision && 'opacity-100'
            )}
          >
            {typeof decision === 'string' ? (
              <div className="my-1 text-sm text-accent font-bold uppercase">
                {decision}
              </div>
            ) : decision ? (
              <div className="flex-center gap-2 font-bold">
                <div className="text-xl leading-none">{decision.count}</div>
                <div className="text-xl">×</div>
                <Dice size="sm" value={decision.value} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
