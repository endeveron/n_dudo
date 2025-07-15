import PlayerCard from '@/core/features/dudo/components/player-card';
import { Player, RecentHistoryResult } from '@/core/features/dudo/types';

interface PlayersDisplayProps {
  inputValue: number;
  currentPlayer: number;
  rolling: boolean;
  players: Player[];
  recentHistoryResult?: RecentHistoryResult;
}

const PlayersDisplay: React.FC<PlayersDisplayProps> = ({
  inputValue,
  currentPlayer,
  players,
  rolling,
  recentHistoryResult,
}) => {
  return (
    <div className="w-[640px] flex-center gap-4 p-2 rounded-xl bg-card/30">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayer}
          isYou={player.id === 0}
          inputValue={inputValue}
          isRolling={rolling}
          recentHistoryResult={recentHistoryResult}
        />
      ))}
    </div>
  );
};

export default PlayersDisplay;
