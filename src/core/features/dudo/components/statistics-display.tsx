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
    <div className={cn('dudo_main_statistics', className)}>
      <div className="translate-x-0.25 flex items-baseline justify-center gap-1.5 leading-none">
        <div className="text-xl font-bold">{totalDiceCount}</div>
        <div className="text-sm text-muted">dice in play</div>
      </div>
    </div>
  );
};

export default StatisticsDisplay;
