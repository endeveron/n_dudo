'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AnimatedCard,
  CardDescription,
  CardTitle,
} from '@/core/components/shared/card';
import FormLoading from '@/core/components/shared/form-loading';
import QRCode from '@/core/components/shared/qr-code';
import { Button } from '@/core/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { processTransactionId } from '@/core/features/premium/actions';
import { usePremium } from '@/core/features/premium/context';
import { useErrorHandler } from '@/core/hooks/error';
import { cn } from '@/core/utils/common';

const monoBaseRegex = /^(?:\d\s*){16}$/; // 16 digits (spaces allowed)
const formSchema = z.object({
  transactionId: z.string().regex(monoBaseRegex, {
    message: 'Invalid transaction ID',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

interface PremiumDialogProps {
  billingUrl: string;
  title: string;
  description?: string;
  onClose: () => void;
  email?: string | null;
}

const PremiumDialog = ({
  email,
  billingUrl,
  description,
  title,
  onClose,
}: PremiumDialogProps) => {
  const { toastError } = useErrorHandler();
  const { processPremium } = usePremium();

  const [isPending, setPending] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionId: '',
    },
  });

  const onSubmit = async ({ transactionId }: FormSchema) => {
    if (!email || !transactionId) return;

    try {
      setPending(true);
      const res = await processTransactionId({
        email,
        transactionId: transactionId.replace(/\s+/g, ''), // Remove spaces
      });
      if (!res?.success) {
        toastError(res);
        return;
      }

      processPremium();
      setSuccess(true);
    } catch (err: unknown) {
      toastError(err);
    } finally {
      setPending(false);
    }
  };

  return isSuccess ? (
    <AnimatedCard className="w-sm px-8">
      <CardTitle>Transaction ID sent</CardTitle>
      <CardDescription>
        <p className="text-center leading-relaxed">
          Your premium will be activated shortly.
          <br />
          Data processing may take some time, so we appreciate your patience.
        </p>
      </CardDescription>

      <Button onClick={() => onClose()} variant="accent">
        Got it
      </Button>
    </AnimatedCard>
  ) : (
    <AnimatedCard className="px-8 translate-y-8">
      <CardTitle>{title}</CardTitle>
      <CardDescription className="flex-center flex-col gap-4">
        {description && <p>{description}</p>}
        <div className="mt-2 space-y-4">
          <div>
            <span className="title text-lg">1. Scan QR code</span>
            <QRCode
              className="mt-2 rounded-xl"
              data={billingUrl}
              margin={2}
              size={200}
            />
          </div>
          <div>
            <span className="title text-lg">2. Complete Payment</span>
          </div>
          <div>
            <span className="title text-lg">3. Enter transaction ID</span>

            <Form {...form}>
              <div className="relative w-50 mt-2">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn(isPending && 'inactive')}
                >
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="text-lg font-semibold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="accent"
                    loading={isPending}
                    className="mt-3 w-full"
                    type="submit"
                  >
                    Activate Premium
                  </Button>
                </form>
                <FormLoading
                  loadigIconClassName="mt-14"
                  isPending={isPending}
                />
              </div>
            </Form>
          </div>
        </div>
      </CardDescription>

      <Button onClick={() => onClose()} variant="outline" loading={isPending}>
        Close
      </Button>
    </AnimatedCard>
  );
};

export default PremiumDialog;
