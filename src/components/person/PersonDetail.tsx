"use client";

import React from "react";
import Link from "next/link";
import { Person, Event, Note } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  Heart,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { formatDate, getAge, getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PersonDetailProps {
  person: Person & {
    father?: Person | null;
    mother?: Person | null;
    spouses?: Array<{ spouse: Person; marriageDate?: Date | null; isCurrent?: boolean }>;
    children?: Person[];
    events?: Event[];
    notes?: Note[];
  };
  onEdit: () => void;
  onAddEvent: () => void;
  onAddNote: () => void;
  onAddSpouse: () => void;
  onAddChild: () => void;
}

export function PersonDetail({
  person,
  onEdit,
  onAddEvent,
  onAddNote,
  onAddSpouse,
  onAddChild,
}: PersonDetailProps) {
  const t = useTranslations("person");

  const age = getAge(person.birthDate, person.deathDate);
  const isMale = person.gender === "MALE";
  const isFemale = person.gender === "FEMALE";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              {person.photoUrl ? (
                <AvatarImage src={person.photoUrl} alt={person.firstName} />
              ) : (
                <AvatarFallback
                  className={`text-2xl text-white font-semibold ${
                    isMale ? "bg-blue-500" : isFemale ? "bg-pink-500" : "bg-purple-500"
                  }`}
                >
                  {getInitials(person.firstName, person.lastName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {person.firstName} {person.middleName && person.middleName + " "}{" "}
                    {person.lastName} {person.suffix}
                  </h1>
                  {person.nickname && (
                    <p className="text-muted-foreground">&ldquo;{person.nickname}&rdquo;</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={person.isLiving ? "default" : "secondary"}>
                      {person.isLiving ? t("isLiving") : t("deceased")}
                    </Badge>
                    <Badge variant="outline">
                      {person.gender === "MALE"
                        ? "Male"
                        : person.gender === "FEMALE"
                        ? "Female"
                        : "Other"}
                    </Badge>
                    {person.isPublic && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
                <Button onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("editPerson")}
                </Button>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {person.birthDate && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">{t("born")}: </span>
                  <span className="font-medium">{formatDate(person.birthDate)}</span>
                  {age !== null && !person.deathDate && (
                    <span className="text-muted-foreground"> ({age} years old)</span>
                  )}
                </div>
              </div>
            )}

            {person.deathDate && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">{t("died")}: </span>
                  <span className="font-medium">{formatDate(person.deathDate)}</span>
                  {age !== null && (
                    <span className="text-muted-foreground"> ({age} years old)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("relationships")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parents */}
            <div>
              <h3 className="font-semibold mb-3">Parents</h3>
              <div className="space-y-2">
                {person.father ? (
                  <PersonLink person={person.father} relation="Father" />
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noFather")}</p>
                )}
                {person.mother ? (
                  <PersonLink person={person.mother} relation="Mother" />
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noMother")}</p>
                )}
              </div>
            </div>

            {/* Spouses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{t("spouses")}</h3>
                <Button size="sm" variant="outline" onClick={onAddSpouse}>
                  <Heart className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {person.spouses && person.spouses.length > 0 ? (
                  person.spouses.map((sp) => (
                    <PersonLink
                      key={sp.spouse.id}
                      person={sp.spouse}
                      relation="Spouse"
                      date={sp.marriageDate}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noSpouse")}</p>
                )}
              </div>
            </div>

            {/* Children */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{t("children")}</h3>
                <Button size="sm" variant="outline" onClick={onAddChild}>
                  <User className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                  {t("addChild")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {person.children && person.children.length > 0 ? (
                  person.children.map((child) => (
                    <PersonLink key={child.id} person={child} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noChildren")}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Events and Notes */}
      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Events
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Events</CardTitle>
                <Button size="sm" onClick={onAddEvent}>
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {person.events && person.events.length > 0 ? (
                <div className="space-y-4">
                  {person.events.map((event) => (
                    <div key={event.id} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{event.type}</h4>
                        {event.date && (
                          <span className="text-sm text-muted-foreground">
                            {formatDate(event.date)}
                          </span>
                        )}
                      </div>
                      {event.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No events recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button size="sm" onClick={onAddNote}>
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {person.notes && person.notes.length > 0 ? (
                <div className="space-y-4">
                  {person.notes.map((note) => (
                    <div key={note.id} className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{note.content}</p>
                      {note.isPrivate && (
                        <Badge variant="outline" className="mt-2">
                          Private
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PersonLinkProps {
  person: Person;
  relation?: string;
  date?: Date | null;
}

function PersonLink({ person, relation, date }: PersonLinkProps) {
  return (
    <Link
      href={`/trees/${person.treeId}/people/${person.id}`}
      className="inline-flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
    >
      <Avatar className="h-8 w-8">
        {person.photoUrl ? (
          <AvatarImage src={person.photoUrl} alt={person.firstName} />
        ) : (
          <AvatarFallback
            className={`text-xs font-medium ${
              person.gender === "MALE"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : person.gender === "FEMALE"
                ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            }`}
          >
            {getInitials(person.firstName, person.lastName)}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <p className="text-sm font-medium">
          {person.firstName} {person.lastName}
        </p>
        {relation && (
          <p className="text-xs text-muted-foreground">
            {relation}
            {date && ` (${formatDate(date)})`}
          </p>
        )}
      </div>
    </Link>
  );
}
