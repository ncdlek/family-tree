"use client";

import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface TreePlaceholderProps {
  onAddFirstPerson: () => void;
}

export function TreePlaceholder({ onAddFirstPerson }: TreePlaceholderProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="mb-6 p-6 bg-muted rounded-full">
        <TreePine className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        Start Your Family Tree
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Add your first family member to begin building your family tree. You can add parents,
        spouses, and children as you go.
      </p>
      <Button onClick={onAddFirstPerson} size="lg">
        Add First Person
      </Button>
    </div>
  );
}
