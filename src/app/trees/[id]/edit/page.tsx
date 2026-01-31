"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TreePine, ArrowLeft, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function EditTreePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const locale = (params.locale as string) || "en";
  const treeId = params.id as string;

  const [tree, setTree] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    hideLiving: true,
  });

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await fetch(`/api/trees/${treeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tree");
      }

      setTree(data.tree);
      setFormData({
        name: data.tree.name,
        description: data.tree.description || "",
        isPublic: data.tree.isPublic,
        hideLiving: data.tree.hideLiving,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Tree name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/trees/${treeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update tree");
      }

      toast({
        title: "Success!",
        description: "Family tree updated successfully",
      });

      setTree(data.tree);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tree",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this family tree? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/trees/${treeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tree");
      }

      toast({
        title: "Deleted",
        description: "Family tree deleted successfully",
      });

      router.push(`/dashboard`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tree",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p>Tree not found</p>
            <Link href={`/dashboard`}>
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/trees/${treeId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Back to Tree
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <TreePine className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Family Tree</CardTitle>
              <CardDescription>Update your family tree settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tree Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Tree</Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone with the link can view this tree
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hideLiving">Hide Living People</Label>
                  <p className="text-sm text-muted-foreground">
                    Living people will be hidden in shared views
                  </p>
                </div>
                <Switch
                  id="hideLiving"
                  checked={formData.hideLiving}
                  onCheckedChange={(checked) => setFormData({ ...formData, hideLiving: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/trees/${treeId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                Delete
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
