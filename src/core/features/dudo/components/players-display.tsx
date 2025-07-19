import PlayerCard from '@/core/features/dudo/components/player-card';
import { Player, RecentHistoryResult } from '@/core/features/dudo/types';

interface PlayersDisplayProps {
  inputValue: number;
  currentPlayer: number;
  isRolling: boolean;
  players: Player[];
  recentHistoryResult?: RecentHistoryResult;
}

const PlayersDisplay: React.FC<PlayersDisplayProps> = ({
  inputValue,
  currentPlayer,
  players,
  isRolling,
  recentHistoryResult,
}) => {
  return (
    <div className="dudo_players ">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayer}
          isYou={player.id === 0}
          inputValue={inputValue}
          isRolling={isRolling}
          recentHistoryResult={recentHistoryResult}
        />
      ))}
    </div>
  );
};

export default PlayersDisplay;
