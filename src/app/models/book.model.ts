export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string[];
  rating: number;
  available: boolean;
  date: Date;
}

export interface Loan {
  id: number;
  book: Book;
  dueDate: Date;
  daysLeft: number;
  isLate: boolean;
}

export interface Review {
  id: number;
  title: string;
  body: string;
  reviewerName: string;
  date: Date;
  rating: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;
}

// ── Rôles ──────────────────────────────────────────
export type UserRole = 1 | 2 | 3;
// 1 = Utilisateur standard
// 2 = Libraire (gestion emprunts + retards)
// 3 = Administrateur (accès total)

export const ROLE_LABELS: Record<UserRole, string> = {
  1: 'User',
  2: 'Librarian',
  3: 'Admin'
};

// ── Utilisateur authentifié ─────────────────────────
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  role: UserRole;
  createdAt: Date;
}

// ── Payload JWT simulé ──────────────────────────────
export interface AuthPayload {
  sub: number;        // user id
  email: string;
  role: UserRole;
  iat: number;        // issued at
  exp: number;        // expiration
}

// ── Réponse de l'API login ──────────────────────────
export interface LoginResponse {
  token: string;
  user: User;
}

// ── Formulaires ─────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: string;
}

