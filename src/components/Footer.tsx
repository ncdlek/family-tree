"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { TreePine } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TreePine className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              FamilyTree © {currentYear}
            </span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link
              href={`/${locale}/privacy`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common" as any)}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common" as any)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
