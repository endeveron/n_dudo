'use client';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import { useCallback, useEffect, useState } from 'react';
import { UserItem } from '@/core/features/admin/types';
import { getUsers } from '@/core/features/admin/actions';
import { Card } from '@/core/components/shared/card';
import { Button } from '@/core/components/ui/button';
import { cn } from '@/core/utils/common';
import { activatePremium } from '@/core/features/premium/actions';

const AdminDashboardClient: React.FC = ({}) => {
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get('e') || undefined;
  const transactionId = searchParams.get('t') || undefined;

  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleActivatePremium = async () => {
    if (!targetEmail || !transactionId) {
      toast('Unable to activate premium. Invalid search params');
      return;
    }

    setIsLoading(true);
    const res = await activatePremium({
      email: targetEmail,
      transactionId,
    });

    if (!res?.success) {
      toast('Unable to activate premium');
      setIsLoading(false);
      return;
    }

    // Success, update local state
    const updUsers = [...users];
    const targetUser = updUsers[0];
    targetUser.premium!.timestamp = Date.now();
    updUsers.splice(0, 1, targetUser);

    setUsers(updUsers);

    setIsLoading(false);
  };

  const initUsers = useCallback(async () => {
    const usersRes = await getUsers();
    if (!usersRes?.success || !usersRes.data) {
      toast('Unable to recieve users');
      return;
    }

    let userItems = usersRes.data;

    // If the search parameters specify a target
    // email address, place the target user first
    if (targetEmail && transactionId) {
      const target = [];
      const others = [];

      for (const item of userItems) {
        if (item.email === targetEmail) {
          target.push({
            ...item,
            selected: true,
          });
        } else {
          others.push(item);
        }
      }

      userItems = [...target, ...others];
    }

    setUsers(userItems);
  }, [targetEmail, transactionId]);

  useEffect(() => {
    initUsers();
  }, [initUsers]);

  return (
    <AnimatedAppear className="pt-20 pb-8 w-full max-w-[640px] flex flex-wrap gap-1">
      {users.map((user) => {
        const transactionId = user.premium?.transactionId;
        const timestamp = user.premium?.timestamp;

        return (
          <Card
            className="relative w-[318px] p-4 sm:pr-4 text-sm"
            key={user.id}
          >
            {user.selected && (
              <div className="absolute top-4 bottom-4 left-0 w-1 bg-accent rounded-xs" />
            )}

            <div className="flex items-center gap-1">
              <div className="w-50 flex flex-col gap-1 font-semibold">
                <span
                  className={cn(
                    'truncate',
                    user.emailConfirmed ? 'text-accent' : 'text-muted'
                  )}
                >
                  {user.email}
                </span>
                <span className="truncate text-accent">{transactionId}</span>
              </div>

              <div className="flex-1 flex-center">
                {timestamp ? (
                  <div className="text-accent font-semibold">Premium</div>
                ) : (
                  <Button
                    size="sm"
                    loading={isLoading}
                    onClick={handleActivatePremium}
                    variant="accent"
                  >
                    ON
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      <div className="w-40 h-200 bg-red-500">200</div>
      <div className="w-40 h-200 bg-red-500">200</div>
      <div className="w-40 h-200 bg-red-500">200</div>
      <div className="w-40 h-200 bg-red-500">200</div>
      <div className="w-40 h-200 bg-red-500">200</div>
      <div className="w-40 h-200 bg-red-500">200</div>
    </AnimatedAppear>
  );
};

export default AdminDashboardClient;
