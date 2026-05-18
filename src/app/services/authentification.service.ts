// TODO : link with Utilisateur BDD

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserRole,
  AuthPayload,
  LoginForm,
  RegisterForm,
  LoginResponse,
} from '../models/model';

// ─────────────────────────────────────────────────────
//  Clé de stockage du token en localStorage
// ─────────────────────────────────────────────────────
const TOKEN_KEY = 'bookhub_token';
const USER_KEY = 'bookhub_user';

// ─────────────────────────────────────────────────────
//  Utilisateurs fictifs (à remplacer par appels API)
// ─────────────────────────────────────────────────────
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 1,
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'user@bookhub.fr',
    password: 'user123',
    phone: '06 12 34 56 78',
    birthDate: new Date('1990-04-15'),
    role: 1,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 2,
    firstName: 'Pierre',
    lastName: 'Lambert',
    email: 'libraire@bookhub.fr',
    password: 'libraire123',
    phone: '06 98 76 54 32',
    birthDate: new Date('1985-09-22'),
    role: 2,
    createdAt: new Date('2023-06-01'),
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'Bibliothèque',
    email: 'admin@bookhub.fr',
    password: 'admin123',
    phone: '02 99 00 00 00',
    birthDate: new Date('1980-03-10'),
    role: 3,
    createdAt: new Date('2023-01-01'),
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ── État réactif ──────────────────────────────────
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  // Accès publics en lecture seule
  currentUser = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  // Raccourcis rôles
  isUser = computed(() => this.currentUserSignal()?.role === 1);
  isLibraire = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 2 || role === 3; // libraire et admin ont les droits libraire
  });
  isAdmin = computed(() => this.currentUserSignal()?.role === 3);

  constructor(private router: Router) {}

  // ─────────────────────────────────────────────────
  //  CONNEXION
  // ─────────────────────────────────────────────────
  login(form: LoginForm): { success: boolean; error?: string } {
    const found = MOCK_USERS.find((u) => u.email === form.email && u.password === form.password);

    if (!found) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }

    // Extraire le mot de passe avant de stocker
    const { password, ...user } = found;

    // Générer un token JWT simulé
    const token = this.generateMockToken(user);

    // Persister
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Mettre à jour le signal
    this.currentUserSignal.set(user);

    return { success: true };
  }

  // ─────────────────────────────────────────────────
  //  INSCRIPTION
  // ─────────────────────────────────────────────────
  register(form: RegisterForm): { success: boolean; error?: string } {
    const exists = MOCK_USERS.find((u) => u.email === form.email);
    if (exists) {
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }

    const newUser: User & { password: string } = {
      id: MOCK_USERS.length + 1,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
      role: 1, // Toujours rôle utilisateur à l'inscription
      createdAt: new Date(),
    };

    MOCK_USERS.push(newUser);

    // Connexion automatique après inscription
    return this.login({ email: form.email, password: form.password });
  }

  // ─────────────────────────────────────────────────
  //  DÉCONNEXION
  // ─────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  // ─────────────────────────────────────────────────
  //  MISE À JOUR DU PROFIL
  // ─────────────────────────────────────────────────
  updateProfile(updates: Partial<User>): { success: boolean; error?: string } {
    const current = this.currentUserSignal();
    if (!current) return { success: false, error: 'Non connecté.' };

    const updated: User = { ...current, ...updates };

    // Persister
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUserSignal.set(updated);

    // Mettre à jour dans le mock
    const idx = MOCK_USERS.findIndex((u) => u.id === current.id);
    if (idx !== -1) Object.assign(MOCK_USERS[idx], updates);

    return { success: true };
  }

  // ─────────────────────────────────────────────────
  //  VÉRIFICATION DE RÔLE
  // ─────────────────────────────────────────────────

  /** Vérifie si l'utilisateur a au moins le rôle requis */
  hasRole(minRole: UserRole): boolean {
    const role = this.currentUserSignal()?.role;
    if (!role) return false;
    return role >= minRole;
  }

  /** Vérifie si l'utilisateur a exactement ce rôle */
  hasExactRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  // ─────────────────────────────────────────────────
  //  TOKEN
  // ─────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────
  //  HELPERS PRIVÉS
  // ─────────────────────────────────────────────────

  /** Charge l'utilisateur depuis le localStorage au démarrage */
  private loadUserFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;

      const user: User = JSON.parse(raw);

      // Vérifier que le token est encore valide
      if (!this.isTokenValid()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  /** Génère un token JWT simulé (base64, non signé — remplacer par vrai JWT côté API) */
  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 jours
      } as AuthPayload),
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  /** Décode le payload d'un token JWT simulé */
  private decodeToken(token: string): AuthPayload {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token invalide');
    return JSON.parse(atob(parts[1]));
  }

  // ─────────────────────────────────────────────────
  //  GESTION UTILISATEURS (admin only)
  // ─────────────────────────────────────────────────

  /** Retourne tous les utilisateurs (sans mot de passe) */
  getAllUsers(): Omit<User, never>[] {
    return MOCK_USERS.map(({ password, ...u }) => u);
  }

  /** Change le rôle d'un utilisateur */
  updateUserRole(userId: number, newRole: UserRole): { success: boolean; error?: string } {
    const idx = MOCK_USERS.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };

    // Empêcher de rétrograder le seul admin restant
    if (MOCK_USERS[idx].role === 3 && newRole < 3) {
      const adminCount = MOCK_USERS.filter(u => u.role === 3).length;
      if (adminCount <= 1) return { success: false, error: 'Impossible : il doit rester au moins un administrateur.' };
    }

    MOCK_USERS[idx].role = newRole;

    // Si l'utilisateur modifié est l'utilisateur courant, mettre à jour le signal
    const current = this.currentUserSignal();
    if (current?.id === userId) {
      const updated = { ...current, role: newRole };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      this.currentUserSignal.set(updated);
    }

    return { success: true };
  }

  /** Supprime un utilisateur (admin only) */
  deleteUser(userId: number): { success: boolean; error?: string } {
    const idx = MOCK_USERS.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };

    if (MOCK_USERS[idx].id === this.currentUserSignal()?.id) {
      return { success: false, error: 'Vous ne pouvez pas supprimer votre propre compte.' };
    }

    MOCK_USERS.splice(idx, 1);
    return { success: true };
  }
}
