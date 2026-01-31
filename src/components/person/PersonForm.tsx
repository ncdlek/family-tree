"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Person, Person as PersonType } from "@/types";
import { Gender } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

const personSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  maidenName: z.string().optional(),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isLiving: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  photoUrl: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonFormData) => void;
  person?: PersonType;
  availableParents?: PersonType[];
  isLoading?: boolean;
}

export function PersonForm({
  open,
  onClose,
  onSubmit,
  person,
  availableParents = [],
  isLoading = false,
}: PersonFormProps) {
  const t = useTranslations("person");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: person
      ? {
          firstName: person.firstName,
          middleName: person.middleName || "",
          lastName: person.lastName || "",
          maidenName: person.maidenName || "",
          suffix: person.suffix || "",
          nickname: person.nickname || "",
          gender: person.gender,
          birthDate: person.birthDate ? new Date(person.birthDate).toISOString().split("T")[0] : "",
          deathDate: person.deathDate ? new Date(person.deathDate).toISOString().split("T")[0] : "",
          isLiving: person.isLiving,
          isPublic: person.isPublic,
          photoUrl: person.photoUrl || "",
          fatherId: person.fatherId || "",
          motherId: person.motherId || "",
        }
      : {
          gender: "UNKNOWN" as Gender,
          isLiving: true,
          isPublic: false,
        },
  });

  const isLiving = watch("isLiving");
  const gender = watch("gender");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = (data: PersonFormData) => {
    onSubmit(data);
  };

  // Filter parents by gender and prevent self-selection
  const fatherOptions = availableParents.filter(
    (p) => p.gender === "MALE" && p.id !== person?.id
  );
  const motherOptions = availableParents.filter(
    (p) => (p.gender === "FEMALE" || p.gender === "OTHER") && p.id !== person?.id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{person ? t("editPerson") : t("addPerson")}</DialogTitle>
          <DialogDescription>
            {person ? "Update the person's information" : "Add a new person to your family tree"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {t("firstName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">{t("middleName")}</Label>
                <Input
                  id="middleName"
                  placeholder="William"
                  {...register("middleName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maidenName">{t("maidenName")}</Label>
                <Input
                  id="maidenName"
                  placeholder="Smith"
                  {...register("maidenName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suffix">{t("suffix")}</Label>
                <Input
                  id="suffix"
                  placeholder="Jr., Sr., III"
                  {...register("suffix")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">{t("nickname")}</Label>
                <Input
                  id="nickname"
                  placeholder="Johnny"
                  {...register("nickname")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                {t("gender")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={gender}
                onValueChange={(value) => setValue("gender", value as Gender)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t("birthDate")}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register("birthDate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deathDate">{t("deathDate")}</Label>
                <Input
                  id="deathDate"
                  type="date"
                  disabled={isLiving}
                  {...register("deathDate")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="isLiving"
                checked={isLiving}
                onCheckedChange={(checked) => setValue("isLiving", checked)}
              />
              <Label htmlFor="isLiving">{t("isLiving")}</Label>
            </div>
          </div>

          {/* Relationships */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("relationships")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherId">{t("father")}</Label>
                <Select
                  value={watch("fatherId")}
                  onValueChange={(value) => setValue("fatherId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectFather")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No father</SelectItem>
                    {fatherOptions.map((father) => (
                      <SelectItem key={father.id} value={father.id}>
                        {father.firstName} {father.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherId">{t("mother")}</Label>
                <Select
                  value={watch("motherId")}
                  onValueChange={(value) => setValue("motherId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectMother")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No mother</SelectItem>
                    {motherOptions.map((mother) => (
                      <SelectItem key={mother.id} value={mother.id}>
                        {mother.firstName} {mother.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy</h3>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="isPublic"
                checked={watch("isPublic")}
                onCheckedChange={(checked) => setValue("isPublic", checked)}
              />
              <Label htmlFor="isPublic">{t("makePublic")}</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("makePublicDescription")}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : person ? t("editPerson") : t("addPerson")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
