"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Globe, Bell, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
  { code: "ar", name: "العربية" },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [preferences, setPreferences] = useState({
    language: locale,
    notifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user profile
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
          });
        }
      })
      .catch(() => {
        // Mock data for demo
        setProfile({
          name: "Demo User",
          email: "demo@example.com",
        });
      });
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: t("profileUpdated"),
      });
    }, 500);
  };

  const handleLanguageChange = (newLocale: string) => {
    setPreferences({ ...preferences, language: newLocale });
    // Redirect to new locale
    const currentPath = window.location.pathname.split(`/${locale}`)[1] || "";
    window.location.href = `/${newLocale}${currentPath ? `/${currentPath}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("settings")}</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("profile")}</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("profile")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("preferences")}</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">{t("language")}</Label>
              <Select
                value={preferences.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">{t("notifications")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("emailPreferences")}
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, notifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("account")}</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={() => {}}>
              {t("changePassword")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
