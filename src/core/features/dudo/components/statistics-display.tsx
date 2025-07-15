import { cn } from '@/core/utils/common';

interface StatisticsDisplayProps {
  totalDiceCount: number;
  className?: string;
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  totalDiceCount,
  className,
}) => {
  return (
    <div className={cn('flex-center flex-col', className)}>
      <div className="flex items-baseline justify-center gap-1.5 leading-none">
        <div className="text-xl font-bold">{totalDiceCount}</div>
        <div className="text-sm text-muted">dice in play</div>
      </div>
    </div>
  );
};

export default StatisticsDisplay;
