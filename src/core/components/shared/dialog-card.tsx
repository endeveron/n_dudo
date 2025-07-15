import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { TWithChildren } from '@/core/types/common';

type DialogCardProps = TWithChildren & {
  title: string;
  description?: string;
};

const DialogCard = ({ title, description, children }: DialogCardProps) => {
  return (
    <Card className="card w-96">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && <div className="mb-4">{description}</div>}
        <div className="flex flex-col">{children}</div>
      </CardContent>
    </Card>
  );
};

DialogCard.displayName = 'DialogCard';

export default DialogCard;
