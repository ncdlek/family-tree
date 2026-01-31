// Re-export Prisma enums
import { Gender, EventType, AccessLevel } from "@prisma/client";
export { Gender, EventType, AccessLevel } from "@prisma/client";

// ============================================
// User & Auth Types
// ============================================

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
}

export interface Session {
  user: User;
}

// ============================================
// Tree Types
// ============================================

export interface Tree {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  isPublic: boolean;
  shareToken: string | null;
  hideLiving: boolean;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    people: number;
  };
}

export interface TreeWithPeople extends Tree {
  people: Person[];
}

// ============================================
// Person Types
// ============================================

export interface Person {
  id: string;
  treeId: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  maidenName: string | null;
  suffix: string | null;
  nickname: string | null;
  gender: Gender;
  birthDate: Date | null;
  deathDate: Date | null;
  isLiving: boolean;
  isPublic: boolean;
  photoUrl: string | null;
  fatherId: string | null;
  motherId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonWithRelations extends Person {
  father: PersonWithRelations | null;
  mother: PersonWithRelations | null;
  childrenAsFather: PersonWithRelations[];
  childrenAsMother: PersonWithRelations[];
  spouses: Spouse[];
  events: Event[];
  notes: Note[];
}

export interface PersonTreeNode {
  id: string;
  data: Person;
  parents: {
    father: PersonTreeNode | null;
    mother: PersonTreeNode | null;
  };
  spouses: PersonTreeNode[];
  children: PersonTreeNode[];
}

// ============================================
// Event Types
// ============================================

export interface Event {
  id: string;
  personId: string;
  type: EventType;
  date: Date | null;
  location: string | null;
  description: string | null;
  sources: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Spouse Types
// ============================================

export interface Spouse {
  id: string;
  personId: string;
  spouseId: string;
  spouse: Person;
  marriageDate: Date | null;
  marriageLocation: string | null;
  divorceDate: Date | null;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Note Types
// ============================================

export interface Note {
  id: string;
  personId: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Access Types
// ============================================

export interface TreeAccess {
  id: string;
  treeId: string;
  userId: string | null;
  userEmail: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Form Types
// ============================================

export interface PersonFormData {
  firstName: string;
  middleName?: string;
  lastName?: string;
  maidenName?: string;
  suffix?: string;
  nickname?: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
  isLiving: boolean;
  isPublic: boolean;
  photoUrl?: string;
  fatherId?: string;
  motherId?: string;
}

export interface TreeFormData {
  name: string;
  description?: string;
  isPublic: boolean;
  hideLiving: boolean;
  language: string;
}

export interface EventFormData {
  type: EventType;
  date?: string;
  location?: string;
  description?: string;
  sources?: string;
}

export interface ShareSettings {
  isPublic: boolean;
  hideLiving: boolean;
  shareToken: string | null;
}

// ============================================
// UI Types
// ============================================

export interface TreeNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    person: Person;
    onPersonClick: (person: Person) => void;
  };
}

export interface TreeEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
}

export interface TreeViewOptions {
  showSpouses: boolean;
  showDates: boolean;
  showPhotos: boolean;
  layout: "hierarchy" | "pedigree" | "descendants";
}

// ============================================
// Filter Types
// ============================================

export interface PersonFilter {
  search?: string;
  gender?: Gender;
  isLiving?: boolean;
  hasPhotos?: boolean;
}

export interface TreeAccessInput {
  userEmail: string;
  accessLevel: AccessLevel;
}

// ============================================
// Export Types
// ============================================

export interface ExportOptions {
  format: "json" | "csv" | "gedcom";
  includePrivate: boolean;
  includeNotes: boolean;
  includeSources: boolean;
}

// ============================================
// Locale Types
// ============================================

export type Locale = "en" | "tr" | "ar";

export interface LocaleMessages {
  common: Record<string, string>;
  tree: Record<string, string>;
  person: Record<string, string>;
  auth: Record<string, string>;
  validation: Record<string, string>;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Chart Types
// ============================================

export interface ChartData {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

export interface LayoutOptions {
  direction: "TB" | "BT" | "LR" | "RL";
  spacing: { x: number; y: number };
}
