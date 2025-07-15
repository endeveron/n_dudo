'use client';

import { ThemeProvider } from '@/core/components/ui/theme-provider';
import { LangProvider } from '@/core/context/lang-context';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <LangProvider>{children}</LangProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
