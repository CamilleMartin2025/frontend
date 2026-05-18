export interface Book {
  id: number;
  titre: string;
  auteur: string;
  categorie: string[];
  resume: string;
  isbn: string;
  quantite: number;
  note: number;
  // available: boolean; --> becomes if quantite > 0
  date_ajout: Date;
}

export interface Loan {
  id: number;
  id_livre: number; //--> getById() in BookService
  id_utilisateur: number; //--> getById() in AuthService
  date_emprunt: Date;
  date_retour_prevu: Date;
  date_retour_effectif: Date; //--> daysLeft calculated effectif-emprunt
  // isLate: boolean; --> isLate if Date today > date_retour_prevu
}

export interface Reservation {
  id: number;
  statut: string;
  id_livre: number;
  id_utilisateur: number;
}

export interface Review {
  id: number;
  // title: string;
  commentaire: string;
  id_utilisateur: number; //--> get name from getById
  date_publication: Date;
  note: number;
  id_livre: number;
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
  prenom: string;
  nom: string;
  email: string;
  tel?: string;
  date_naissance?: Date;
  role: UserRole; //--> switch to id_role
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

