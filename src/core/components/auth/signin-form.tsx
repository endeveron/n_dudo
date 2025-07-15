'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signIn } from '@/core/actions/auth';
import VisibilityToggle from '@/core/components/auth/visibility-toggle';
import FormLoading from '@/core/components/shared/form-loading';
import { Button } from '@/core/components/ui/button';
import {
  Form,
  FormControl,
  FormControlIcon,
  FormControlWithIcon,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { useErrorHandler } from '@/core/hooks/error';
import { SignInSchema, signInSchema } from '@/core/schemas/auth';
import { SignInArgs } from '@/core/types/auth';
import { cn } from '@/core/utils/common';

const SignInForm = () => {
  const searchParams = useSearchParams();
  const { toastError } = useErrorHandler();

  const [isPending, setPending] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const redirectTo = searchParams.get('redirectTo') || undefined;

  const onSubmit = async (values: SignInSchema) => {
    const signinData: SignInArgs = {
      email: values.email.toLowerCase(),
      password: values.password,
      redirectTo,
    };

    try {
      setPending(true);
      const res = await signIn(signinData);
      if (!res?.success) {
        toastError(res);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      // toastError(err);
    } finally {
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControlWithIcon>
                  <FormControlIcon>
                    <VisibilityToggle
                      onClick={() => setPwdVisible((prev) => !prev)}
                    />
                  </FormControlIcon>
                  <Input {...field} type={pwdVisible ? 'text' : 'password'} />
                </FormControlWithIcon>
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
            Sign In
          </Button>
          {/* <div className="flex justify-center">
          <Link href="/sign-up" className="auth-form_link">
            Create an account
          </Link>
        </div> */}
        </form>
        <FormLoading loadigIconClassName="-mt-14" isPending={isPending} />
      </div>
    </Form>
  );
};

export default SignInForm;
