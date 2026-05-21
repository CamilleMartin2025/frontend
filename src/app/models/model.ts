export interface Book {
  id: number;
  titre: string;
  auteur: string;
  categorie: string;
  resume: string;
  isbn: string;
  quantite: number;
  note: number;
  // available: boolean; --> becomes if quantite > 0
  date_ajout: Date;
}

// ── Interface brute renvoyée par l'API ──────────────
export interface Loan {
  id: number;
  livreId: number;
  utilisateurId: number;
  dateEmprunt: string;        // ISO string ex: "2026-04-01T00:00:00"
  dateRetourPrevu: string;   // ISO string ex: "2026-05-15T00:00:00"
  dateRetourEffectif: string | null; // null si pas encore rendu
}

// ── Interface enrichie utilisée dans les templates ──
export interface LoanView {
  id: number;
  id_livre: number;
  id_utilisateur: number;
  date_emprunt: Date;
  date_retour_prevu: Date;
  date_retour_effectif: Date | null;
  daysLeft: number;      // négatif si en retard
  isLate: boolean;
  book: Book;
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
  utilisateurId: number; //--> get name from getById
  utilisateurNom: string;
  date_publication: Date;
  note: number;
  livreId: number;
}

// ═══════════════════════════════════════════════════
//  RÔLES
// ═══════════════════════════════════════════════════

export type UserRole = 1 | 2 | 3;
//  1 = Utilisateur standard
//  2 = Libraire
//  3 = Administrateur

export const ROLE_LABELS: Record<UserRole, string> = {
  1: 'Utilisateur',
  2: 'Libraire',
  3: 'Administrateur'
};

// ── Objet User tel que renvoyé par l'API ────────────
export interface User {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  tel?: string;
  date_naissance?: string;  // ISO string "YYYY-MM-DD"
  role: string;           // ← champ rôle de l'API
}

// ── Payload décodé depuis le JWT ────────────────────
export interface JwtPayload {
  sub: number;       // id utilisateur
  email: string;
  role: UserRole;    // rôle
  iat: number;       // issued at (timestamp)
  exp: number;       // expiration (timestamp)
}

// ── Réponse de l'endpoint POST /api/auth/login ──────
// ⚠️  Adapter selon ce que ton API renvoie réellement
//     Option A : { token: string, user: User }
//     Option B : { access_token: string }  (sans user)
//     Option C : cookie httpOnly (pas de token visible)
export interface LoginResponse {
  token: string;    // ← renommer en access_token si besoin
  user?: User;      // ← optionnel si l'API ne renvoie pas le user directement
}

// ── Corps du POST /api/auth/login ───────────────────
export interface LoginForm {
  email: string;
  password: string;   // ← renommer en mot_de_passe si l'API l'attend ainsi
}

// ── Corps du POST /api/auth/register ────────────────
export interface RegisterForm {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  tel?: string;
  date_naissance?: string;
}
