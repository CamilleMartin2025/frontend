// TODO : link with Utilisateur BDD

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserRole,
  AuthPayload,
  LoginForm,
  RegisterForm,
  LoginResponse, Loan,
} from '../models/model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiLoanUser = '/api/users';
  private router: any;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiLoanUser);
  }

  getUserById(id: number): Observable<User> {
    // @ts-ignore
    return this.getAll().pipe(map((users) => users.find((b) => b.id === id)));
  }

  // ── État réactif ──────────────────────────────────
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  // Accès publics en lecture seule
  currentUser = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  // Raccourcis rôles
  isUser = computed(() => this.currentUserSignal()?.role === 3);
  isLibraire = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 2 || role === 1; // libraire et admin ont les droits libraire
  });
  isAdmin = computed(() => this.currentUserSignal()?.role === 1);

  // ─────────────────────────────────────────────────
  //  CONNEXION
  // ─────────────────────────────────────────────────
  login(form: LoginForm): { success: boolean; error?: string } {
    const found = this.getAll().find((u) => u.email === form.email && u.password === form.password);

    if (!found) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }

    // Extraire le mot de passe avant de stocker
    const { password, ...user } = found;

    // Générer un token JWT simulé
    const token = this.generateMockToken(user);

    // Mettre à jour le signal
    this.currentUserSignal.set(user);

    return { success: true };
  }

  // ─────────────────────────────────────────────────
  //  INSCRIPTION
  // ─────────────────────────────────────────────────
  register(form: RegisterForm): { success: boolean; error?: string } {
    const exists = this.getAll().find((u) => u.email === form.email);
    if (exists) {
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }

    const newUser: User & { password: string } = {
      id: this.getAll().length + 1,
      prenom: form.firstName,
      nom: form.lastName,
      email: form.email,
      password: form.password,
      tel: form.phone,
      date_naissance: form.birthDate ? new Date(form.birthDate) : undefined,
      role: 1, // Toujours rôle utilisateur à l'inscription
    };

    this.getAll().push(newUser);

    // Connexion automatique après inscription
    return this.login({ email: form.email, password: form.password });
  }

  // ─────────────────────────────────────────────────
  //  DÉCONNEXION
  // ─────────────────────────────────────────────────
  logout(): void {
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
    this.currentUserSignal.set(updated);

    // Mettre à jour dans le mock
    const idx = this.getAll().findIndex((u) => u.id === current.id);
    if (idx !== -1) Object.assign(this.getAll().[idx], updates);

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
  //  HELPERS PRIVÉS
  // ─────────────────────────────────────────────────

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
    return this.getAll().map(({ password, ...u }) => u);
  }

  /** Change le rôle d'un utilisateur */
  updateUserRole(userId: number, newRole: UserRole): { success: boolean; error?: string } {
    const idx = this.getAll().findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };

    // Empêcher de rétrograder le seul admin restant
    if (this.getAll().[idx].role === 3 && newRole < 3) {
      const adminCount = this.getAll().filter((u) => u.role === 3).length;
      if (adminCount <= 1)
        return { success: false, error: 'Impossible : il doit rester au moins un administrateur.' };
    }

    this.getAll().[idx].role = newRole;

    // Si l'utilisateur modifié est l'utilisateur courant, mettre à jour le signal
    const current = this.currentUserSignal();
    if (current?.id === userId) {
      const updated = { ...current, role: newRole };
      this.currentUserSignal.set(updated);
    }

    return { success: true };
  }

  /** Supprime un utilisateur (admin only) */
  deleteUser(userId: number): { success: boolean; error?: string } {
    const idx = this.getAll().findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };

    if (this.getAll().[idx].id === this.currentUserSignal()?.id) {
      return { success: false, error: 'Vous ne pouvez pas supprimer votre propre compte.' };
    }

    this.getAll().splice(idx, 1);
    return { success: true };
  }
}
