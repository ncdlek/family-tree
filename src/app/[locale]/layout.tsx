import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/providers";
import "../globals.css";
import { locales, isRTL } from "@/i18n";

// Force dynamic rendering for i18n
export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Using setRequestLocale to enable proper locale handling
  const { setRequestLocale } = await import("next-intl/server");
  setRequestLocale(locale);

  const messages = await getMessages();
  const rtl = isRTL(locale as any);

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers locale={locale} messages={messages}>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
