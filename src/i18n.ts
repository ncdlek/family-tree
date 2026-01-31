import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const rtlLocales: Locale[] = ["ar"];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
