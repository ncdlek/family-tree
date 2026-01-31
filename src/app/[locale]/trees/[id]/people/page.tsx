"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export default function TreePeoplePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const locale = (params.locale as string) || "en";
  const treeId = params.id as string;

  const [tree, setTree] = useState<any>(null);
  const [people, setPeople] = useState<any[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
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
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "FEMALE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/${locale}/trees/${treeId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Back to Tree
          </Button>
        </Link>
        <Link href={`/${locale}/trees/${treeId}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Add Person
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tree?.name || "Family Tree"} - People</CardTitle>
          <CardDescription>
            {people.length} {people.length === 1 ? "person" : "people"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : filteredPeople.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No people found" : "No people in this tree yet"}
              </p>
              {!searchQuery && (
                <Link href={`/${locale}/trees/${treeId}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Add Your First Person
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((person) => (
                <Card
                  key={person.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/${locale}/trees/${treeId}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        {person.photoUrl ? (
                          <img
                            src={person.photoUrl}
                            alt={person.firstName}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback
                            className={getGenderColor(person.gender)}
                          >
                            {getInitials(person.firstName, person.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {person.firstName} {person.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {person.gender === "MALE"
                            ? "Male"
                            : person.gender === "FEMALE"
                            ? "Female"
                            : "Other"}
                        </p>
                        {person.birthDate && (
                          <p className="text-xs text-muted-foreground">
                            Born: {new Date(person.birthDate).getFullYear()}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2">
                          {person.isPublic && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                          {!person.isLiving && (
                            <Badge variant="secondary" className="text-xs">
                              Deceased
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
