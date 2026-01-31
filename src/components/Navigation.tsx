"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Button as ButtonUI } from "@/components/ui/button"; // Will be replaced with Apple-style button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User, LogOut, Menu, ChevronDown, X, TreePine } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        // Ignore error
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/trees", label: "My Trees" },
      ]
    : [];

  // Get locale from pathname
  const locale = pathname?.split("/")[1] || "en";
  const isRTL = locale === "ar";

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/40 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
              <TreePine className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block tracking-tight">
              FamilyTree
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {!isLoading && !user && (
              <>
                <Link href={`/${locale}/login`}>
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href={`/${locale}/signup`}>
                  <Button size="sm" className="text-sm shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {user && (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-xs font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline-block text-sm font-medium">
                        {user.name || "User"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isRTL ? "rotate-180" : ""}`} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 border-b">
                      <p className="text-xs font-medium text-muted-foreground">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/settings`} className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings Icon (mobile) */}
                <Link href={`/${locale}/settings`} className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            {!user && (
              <>
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50"
                >
                  Sign In
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
