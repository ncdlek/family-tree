"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TreePine, Settings, User, LogOut, Menu, Globe } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  userId?: string;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export function Navigation({ userId }: NavigationProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  const changeLocale = (newLocale: string) => {
    const currentPath = pathname?.split(`/${locale}`)[1] || "";
    window.location.href = `/${newLocale}${currentPath}`;
  };

  const isRTL = locale === "ar";

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 rtl:space-x-reverse">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">
              FamilyTree
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {userId && (
              <>
                <Link href={`/${locale}/dashboard`}>
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    size="sm"
                  >
                    {t("dashboard")}
                  </Button>
                </Link>
                <Link href={`/${locale}/trees`}>
                  <Button
                    variant={isActive("/trees") ? "default" : "ghost"}
                    size="sm"
                  >
                    {t("trees")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLocale(lang.code)}
                    className={locale === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {userId ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/settings`} className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/api/auth/signout`} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {t("logout")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                <Link href={`/${locale}/login`}>
                  <Button variant="ghost" size="sm">
                    {t("login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/signup`}>
                  <Button size="sm">
                    {t("signup")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {userId ? (
                <>
                  <Link href={`/${locale}/dashboard`}>
                    <Button
                      variant={isActive("/dashboard") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("dashboard")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/trees`}>
                    <Button
                      variant={isActive("/trees") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("trees")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/settings`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {t("settings")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/api/auth/signout`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {t("logout")}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/${locale}/login`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/signup`}>
                    <Button
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("signup")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
