import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export function formatYear(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.getFullYear().toString();
}

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function getAge(birthDate: Date | string | null, deathDate?: Date | string | null): number | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();

  if (isNaN(birth.getTime())) return null;

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function isLiving(birthDate: Date | string | null, deathDate: Date | string | null, isLivingFlag: boolean): boolean {
  if (deathDate) return false;
  if (!isLivingFlag) return false;
  if (!birthDate) return true;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return true;

  // Consider people born more than 120 years ago as deceased
  const maxAge = 120;
  const age = getAge(birthDate);
  return age !== null && age < maxAge;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

export function getGenderColor(gender: string): string {
  switch (gender) {
    case "MALE":
      return "blue";
    case "FEMALE":
      return "pink";
    default:
      return "purple";
  }
}
