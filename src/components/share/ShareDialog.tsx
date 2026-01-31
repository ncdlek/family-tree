"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Link as LinkIcon, Mail, UserPlus, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  treeId: string;
  treeName: string;
  isPublic: boolean;
  hideLiving: boolean;
  shareToken: string | null;
  onUpdateSettings: (settings: { isPublic: boolean; hideLiving: boolean }) => void;
  onGenerateToken: () => Promise<string>;
  onRevokeAccess: (accessId: string) => Promise<void>;
  onInviteUser: (email: string, accessLevel: string) => Promise<void>;
}

interface TreeAccess {
  id: string;
  userEmail: string;
  accessLevel: "VIEW" | "EDIT" | "ADMIN";
  user?: {
    name: string | null;
    image: string | null;
  } | null;
}

export function ShareDialog({
  open,
  onClose,
  treeId,
  treeName,
  isPublic,
  hideLiving,
  shareToken,
  onUpdateSettings,
  onGenerateToken,
  onRevokeAccess,
  onInviteUser,
}: ShareDialogProps) {
  const t = useTranslations("share");
  const { toast } = useToast();
  const [localIsPublic, setLocalIsPublic] = useState(isPublic);
  const [localHideLiving, setLocalHideLiving] = useState(hideLiving);
  const [inviteEmail, setInviteEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<string>("VIEW");
  const [isInviting, setIsInviting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock shared users - in real app, fetch from API
  const [sharedUsers, setSharedUsers] = React.useState<TreeAccess[]>([]);

  const shareUrl = shareToken
    ? `${window.location.origin}/shared/${shareToken}`
    : "";

  const handleCopyLink = async () => {
    if (!shareToken) {
      toast({
        title: "Error",
        description: "Please generate a share link first",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Success",
        description: t("linkCopied"),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      await onGenerateToken();
      toast({
        title: "Success",
        description: "New share link generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setIsInviting(true);
    try {
      await onInviteUser(inviteEmail, accessLevel);
      toast({
        title: "Success",
        description: t("inviteSent"),
      });
      setInviteEmail("");
      setAccessLevel("VIEW");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invite",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    try {
      await onRevokeAccess(accessId);
      setSharedUsers((prev) => prev.filter((u) => u.id !== accessId));
      toast({
        title: "Success",
        description: t("accessRevoked"),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      isPublic: localIsPublic,
      hideLiving: localHideLiving,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("shareTree")}</DialogTitle>
          <DialogDescription>
            Manage who can access your family tree
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Public Access Settings */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public">{t("publicTree")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("publicTreeDescription")}
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={localIsPublic}
                  onCheckedChange={setLocalIsPublic}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hideLiving">{t("hideLiving")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("hideLivingDescription")}
                  </p>
                </div>
                <Switch
                  id="hideLiving"
                  checked={localHideLiving}
                  onCheckedChange={setLocalHideLiving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Share Link */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{t("shareLink")}</h3>
              </div>

              {shareToken ? (
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleGenerateToken}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateToken}
                  variant="outline"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Share Link"}
                </Button>
              )}

              <p className="text-xs text-muted-foreground">
                {t("anyoneWithLink")}
              </p>
            </CardContent>
          </Card>

          {/* Invite by Email */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{t("inviteByEmail")}</h3>
              </div>

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("emailAddress")}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEW">{t("accessLevels.VIEW")}</SelectItem>
                    <SelectItem value="EDIT">{t("accessLevels.EDIT")}</SelectItem>
                    <SelectItem value="ADMIN">{t("accessLevels.ADMIN")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail || isInviting}
                >
                  <UserPlus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isInviting ? "Sending..." : t("sendInvite")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* People with Access */}
          {sharedUsers.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <UserPlus className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{t("peopleWithAccess")}</h3>
                </div>

                <div className="space-y-3">
                  {sharedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.user?.name?.[0] || user.userEmail[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.user?.name || user.userEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.user?.name && user.userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{t(`accessLevels.${user.accessLevel}`)}</Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRevokeAccess(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
