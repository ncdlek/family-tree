"use client";

import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Person } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getAge } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  data: {
    person: Person;
    onPersonClick: (person: Person) => void;
  };
  selected?: boolean;
}

export const PersonCard = memo(({ data, selected }: PersonCardProps) => {
  const { person, onPersonClick } = data;
  const age = getAge(person.birthDate, person.deathDate);
  const isMale = person.gender === "MALE";
  const isFemale = person.gender === "FEMALE";

  return (
    <div
      className={cn(
        "person-card cursor-pointer transition-all duration-200",
        isMale && "male",
        isFemale && "female",
        !isMale && !isFemale && "other",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={() => onPersonClick(person)}
    >
      {/* Input handles for edges */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />

      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          {person.photoUrl ? (
            <AvatarImage src={person.photoUrl} alt={person.firstName} />
          ) : (
            <AvatarFallback
              className={cn(
                "text-white font-semibold",
                isMale && "bg-blue-500",
                isFemale && "bg-pink-500",
                !isMale && !isFemale && "bg-purple-500"
              )}
            >
              {getInitials(person.firstName, person.lastName)}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">
            {person.firstName} {person.lastName}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {person.nickname || (isMale ? "Male" : isFemale ? "Female" : "Other")}
          </p>
          {person.birthDate && (
            <p className="text-xs text-muted-foreground">
              {new Date(person.birthDate).getFullYear()}
              {person.deathDate && (
                <span> - {new Date(person.deathDate).getFullYear()}</span>
              )}
              {age !== null && !person.deathDate && (
                <span className="ml-1">({age}y)</span>
              )}
            </p>
          )}
        </div>

        {!person.isLiving && (
          <div className="text-xs bg-muted px-2 py-1 rounded">✝</div>
        )}
      </div>
    </div>
  );
});

PersonCard.displayName = "PersonCard";
