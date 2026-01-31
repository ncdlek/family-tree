"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import type { AbstractIntlMessages } from "next-intl";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
