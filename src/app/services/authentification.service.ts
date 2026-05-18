import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import {
  User,
  UserRole,
  LoginForm,
  RegisterForm,
  LoginResponse,
  JwtPayload,
} from '../models/model';

// ─────────────────────────────────────────────────────
//  ⚠️  ENDPOINTS — adapter selon ton API
// ─────────────────────────────────────────────────────
const API = {
  login: 'http://localhost:8080/api/auth', // POST  → LoginResponse
  register: 'http://localhost:8080/api/auth', // POST  → LoginResponse
  me: 'http://localhost:8080/api/auth', // GET   → User  (si dispo)
  users: 'http://localhost:8080/api/auth', // GET   → User[]
};

// ─────────────────────────────────────────────────────
//  Clés localStorage
// ─────────────────────────────────────────────────────
const TOKEN_KEY = 'bookhub_token';
const USER_KEY = 'bookhub_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ── État réactif ───────────────────────────────────
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  // Raccourcis rôles — logique inclusive (admin a aussi les droits libraire)
  isUser = computed(() => {
    const r = this.currentUserSignal()?.role;
    return r === 1 || r === 2 || r === 3;
  });
  isLibraire = computed(() => {
    const r = this.currentUserSignal()?.role;
    return r === 2 || r === 3;
  });
  isAdmin = computed(() => this.currentUserSignal()?.role === 3);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // ═══════════════════════════════════════════════════
  //  CONNEXION
  // ═══════════════════════════════════════════════════
  login(form: LoginForm): Observable<User> {
    return this.http.post<LoginResponse>(API.login, form).pipe(
      // L'API renvoie { token, user } — Option B (décodage JWT) en fallback
      // si user est absent de la réponse

      tap((response) => {
        // Stocker le token
        const token = response.token;
        localStorage.setItem(TOKEN_KEY, token);

        // Récupérer le user
        if (response.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          this.currentUserSignal.set(response.user);
        } else {
          // Fallback : décoder le JWT si user absent de la réponse
          const payload = this.decodeJwt(token);
          if (payload) {
            // On reconstruit un User partiel depuis le JWT
            const partialUser: User = {
              id: payload.sub,
              email: payload.email,
              role: payload.role,
              prenom: '',
              nom: '',
            };
            localStorage.setItem(USER_KEY, JSON.stringify(partialUser));
            this.currentUserSignal.set(partialUser);

            // Optionnel : récupérer le profil complet en arrière-plan
            this.fetchMe().subscribe();
          }
        }
      }),

      // Retourner le User pour que le composant puisse réagir
      map(() => this.currentUserSignal()!),

      catchError((err) => {
        const message =
          err.error?.message ?? err.error?.detail ?? 'Email ou mot de passe incorrect.';
        return throwError(() => new Error(message));
      }),
    );
  }

  // ═══════════════════════════════════════════════════
  //  INSCRIPTION
  // ═══════════════════════════════════════════════════
  register(form: RegisterForm): Observable<User> {
    return this.http.post<LoginResponse>(API.register, form).pipe(
      tap((response) => {
        const token = response.token;
        localStorage.setItem(TOKEN_KEY, token);

        if (response.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          this.currentUserSignal.set(response.user);
        } else {
          const payload = this.decodeJwt(token);
          if (payload) {
            const partialUser: User = {
              id: payload.sub,
              email: payload.email,
              role: payload.role,
              prenom: form.prenom,
              nom: form.nom,
              tel: form.tel,
            };
            localStorage.setItem(USER_KEY, JSON.stringify(partialUser));
            this.currentUserSignal.set(partialUser);
          }
        }
      }),
      map(() => this.currentUserSignal()!),
      catchError((err) => {
        const message = err.error?.message ?? "Erreur lors de l'inscription.";
        return throwError(() => new Error(message));
      }),
    );
  }

  // ═══════════════════════════════════════════════════
  //  RÉCUPÉRER LE PROFIL COMPLET (/api/auth/me)
  //  ⚠️  Supprimer si ton API n'a pas cet endpoint
  // ═══════════════════════════════════════════════════
  fetchMe(): Observable<User> {
    return this.http.get<User>(API.me, { headers: this.authHeaders() }).pipe(
      tap((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
      catchError((err) => {
        // Si /me échoue (token expiré, etc.) → déconnexion propre
        if (err.status === 401) this.logout();
        return throwError(() => err);
      }),
    );
  }

  // ═══════════════════════════════════════════════════
  //  DÉCONNEXION
  // ═══════════════════════════════════════════════════
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  // ═══════════════════════════════════════════════════
  //  GESTION UTILISATEURS (admin only)
  // ═══════════════════════════════════════════════════
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API.users, { headers: this.authHeaders() });
  }

  updateUserRole(userId: number, newRole: UserRole): Observable<User> {
    // ⚠️  Adapter l'endpoint et le corps selon ton API
    //     ex: PATCH /api/users/5/role  ou  PUT /api/users/5
    return this.http
      .patch<User>(
        `${API.users}/${userId}/role`,
        { role: newRole }, // ← adapter le nom du champ si besoin
        { headers: this.authHeaders() },
      )
      .pipe(
        catchError((err) => {
          const message = err.error?.message ?? 'Impossible de modifier le rôle.';
          return throwError(() => new Error(message));
        }),
      );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${API.users}/${userId}`, { headers: this.authHeaders() });
  }

  // ═══════════════════════════════════════════════════
  //  MISE À JOUR DU PROFIL
  // ═══════════════════════════════════════════════════
  updateProfile(updates: Partial<User>): Observable<User> {
    const current = this.currentUserSignal();
    if (!current) return throwError(() => new Error('Non connecté.'));

    return this.http
      .put<User>(`${API.users}/${current.id}`, updates, { headers: this.authHeaders() })
      .pipe(
        tap((updated) => {
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
          this.currentUserSignal.set(updated);
        }),
        catchError((err) => {
          const message = err.error?.message ?? 'Erreur lors de la mise à jour.';
          return throwError(() => new Error(message));
        }),
      );
  }

  // ═══════════════════════════════════════════════════
  //  VÉRIFICATION DE RÔLE
  // ═══════════════════════════════════════════════════

  /** L'utilisateur a-t-il au moins ce niveau de rôle ? */
  hasRole(minRole: UserRole): boolean {
    const role = this.currentUserSignal()?.role;
    return role !== undefined && role >= minRole;
  }

  // ═══════════════════════════════════════════════════
  //  TOKEN
  // ═══════════════════════════════════════════════════
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Headers HTTP avec le token Bearer */
  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /** Le token stocké est-il encore valide (non expiré) ? */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeJwt(token);
    if (!payload) return false;
    return payload.exp > Date.now() / 1000;
  }

  // ═══════════════════════════════════════════════════
  //  HELPERS PRIVÉS
  // ═══════════════════════════════════════════════════

  /** Charge l'utilisateur depuis localStorage au démarrage de l'app */
  private loadUserFromStorage(): User | null {
    try {
      if (!this.isTokenValid()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  /** Décode le payload d'un JWT sans vérifier la signature */
  private decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }
}
