'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { signUp } from '@/core/features/auth/actions';
import { useErrorHandler } from '@/core/hooks/error';
import { SignUpSchema, signUpSchema } from '@/core/features/auth/schemas';
import FormLoading from '@/core/components/shared/form-loading';
import { cn } from '@/core/utils/common';

const SignUpForm = () => {
  const router = useRouter();
  const { toastError } = useErrorHandler();
  const [isPending, setPending] = useState(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    try {
      setPending(true);
      const res = await signUp({ email: values.email.toLowerCase() });
      if (!res?.success) {
        toastError(res);
        setPending(false);
        return;
      }

      // If success, redirect to the email verify page
      router.push(`/email/verify?e=${values.email}`);
    } catch (err: unknown) {
      toastError(err);
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <div className="relative">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('auth-form ', isPending && 'inactive')}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="accent"
            loading={isPending}
            className="auth-form_button"
            type="submit"
          >
            Continue
          </Button>
          <div className="flex justify-center">
            <Link href="/signin" className="auth-form_link">
              Already have an account ?
            </Link>
          </div>
          <FormLoading loadigIconClassName="-mt-14" isPending={isPending} />
        </form>
        <FormLoading loadigIconClassName="-mt-14" isPending={isPending} />
      </div>
    </Form>
  );
};

export default SignUpForm;
