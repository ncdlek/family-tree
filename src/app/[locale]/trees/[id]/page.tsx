"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FamilyTree } from "@/components/tree/FamilyTree";
import { PersonForm } from "@/components/person/PersonForm";
import { ShareDialog } from "@/components/share/ShareDialog";
import { PersonDetail } from "@/components/person/PersonDetail";
import { TreePlaceholder } from "@/components/tree/TreePlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Share,
  Users,
  Plus,
  Search,
  MoreVertical,
  Download,
} from "lucide-react";
import { Person, Tree } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function TreeViewPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [tree, setTree] = useState<Tree | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const treeId = params.id as string;
  const locale = params.locale as string;

  useEffect(() => {
    fetchTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeId]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = people.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.lastName && p.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPeople(filtered);
    } else {
      setFilteredPeople(people);
    }
  }, [searchQuery, people]);

  const fetchTree = async () => {
    try {
      const response = await fetch(`/api/trees/${treeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tree");
      }

      setTree(data.tree);
      setPeople(data.tree.people || []);
      setFilteredPeople(data.tree.people || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonClick = (person: Person) => {
    // In a real app, fetch full person details with relationships
    setSelectedPerson(person);
  };

  const handleAddPerson = async (data: any) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/trees/${treeId}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add person");
      }

      toast({
        title: "Success",
        description: "Person added successfully!",
      });

      setShowPersonForm(false);
      fetchTree();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePerson = async (data: any) => {
    if (!editingPerson) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/people/${editingPerson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update person");
      }

      toast({
        title: "Success",
        description: "Person updated successfully!",
      });

      setEditingPerson(null);
      setShowPersonForm(false);
      fetchTree();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePerson = async (personId: string) => {
    if (!confirm("Are you sure you want to delete this person?")) return;

    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete person");
      }

      toast({
        title: "Success",
        description: "Person deleted successfully!",
      });

      setSelectedPerson(null);
      fetchTree();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/trees/${treeId}/export?format=${format}`);

      if (!response.ok) {
        throw new Error("Failed to export tree");
      }

      if (format === "json") {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tree?.name || "family-tree"}.json`;
        a.click();
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tree?.name || "family-tree"}.${format === "gedcom" ? "ged" : "csv"}`;
        a.click();
      }

      toast({
        title: "Success",
        description: "Tree exported successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tree not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <div>
                <h1 className="text-xl font-bold">{tree.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {people.length} {people.length === 1 ? "person" : "people"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>

              {/* Add Person */}
              <Button onClick={() => { setEditingPerson(null); setShowPersonForm(true); }}>
                <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                Add Person
              </Button>

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("gedcom")}>
                    Export as GEDCOM
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Share */}
              <Button variant="outline" onClick={() => setShowShareDialog(true)}>
                <Share className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                Share
              </Button>

              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/trees/${treeId}/edit`)}>
                    <Settings className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Tree Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/trees/${treeId}/people`)}>
                    <Users className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Manage People
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        {selectedPerson ? (
          <div className="h-full overflow-y-auto">
            <PersonDetail
              person={selectedPerson as any}
              onEdit={() => { setEditingPerson(selectedPerson); setShowPersonForm(true); }}
              onAddEvent={() => {}}
              onAddNote={() => {}}
              onAddSpouse={() => {}}
              onAddChild={() => {}}
            />
            <Button
              variant="ghost"
              className="m-4"
              onClick={() => setSelectedPerson(null)}
            >
              Back to Tree
            </Button>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <TreePlaceholder onAddFirstPerson={() => setShowPersonForm(true)} />
          </div>
        ) : (
          <FamilyTree
            people={filteredPeople}
            onPersonClick={handlePersonClick}
            className="h-full"
          />
        )}
      </div>

      {/* Person Form Dialog */}
      <PersonForm
        open={showPersonForm}
        onClose={() => setShowPersonForm(false)}
        onSubmit={editingPerson ? handleUpdatePerson : handleAddPerson}
        person={editingPerson || undefined}
        availableParents={people.filter((p) => p.id !== editingPerson?.id)}
        isLoading={isSaving}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        treeId={treeId}
        treeName={tree.name}
        isPublic={tree.isPublic}
        hideLiving={tree.hideLiving}
        shareToken={tree.shareToken}
        onUpdateSettings={async (settings) => {
          await fetch(`/api/trees/${treeId}/share`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
          });
          setTree({ ...tree, ...settings });
        }}
        onGenerateToken={async () => {
          const response = await fetch(`/api/trees/${treeId}/share`, { method: "POST" });
          const data = await response.json();
          setTree({ ...tree, shareToken: data.shareToken });
          return data.shareToken;
        }}
        onRevokeAccess={async (accessId) => {
          await fetch(`/api/trees/${treeId}/invite`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessId }),
          });
        }}
        onInviteUser={async (email, accessLevel) => {
          await fetch(`/api/trees/${treeId}/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, accessLevel }),
          });
        }}
      />
    </div>
  );
}
