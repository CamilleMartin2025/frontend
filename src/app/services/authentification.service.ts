import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, LoginForm, RegisterForm, UserRole, Book } from '../models/model';

const TOKEN_KEY = 'bookhub_token';
const USER_KEY = 'bookhub_user';

const API = {
  login: 'http://localhost:8080/api/auth/login', // POST  → LoginResponse
  register: 'http://localhost:8080/api/auth/register', // POST  → LoginResponse
  me: 'http://localhost:8080/api/auth', // GET   → User  (si dispo)
  users: 'http://localhost:8080/api/auth', // GET   → User[]
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private registerUrl = 'http://localhost:8080/api/auth/register';
  private apiRoleUrl = 'http://localhost:8080/api/roles';

  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUser() !== null);
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // POST AUTHENTIFICATION
  login(credentials: LoginForm): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap((response) => {
        const token = response?.token || response;

        if (token && typeof token === 'string') {
          localStorage.setItem(TOKEN_KEY, token);

          // 1. On décode le JWT pour extraire les informations cachées dedans
          const payload = this.decodeJwt(token);
          console.log('Payload du JWT décodé :', payload);

          // On reconstruit l'utilisateur grâce aux clés du JWT
          const user: User = {
            id: payload?.id || 0,
            email: payload?.sub || credentials.email, // 'sub' contient l'identifiant/email dans un JWT standard
            prenom: payload?.prenom || '',
            nom: payload?.nom || '',
            // S'adapte si Spring envoie un tableau ou une string (ex: 'ROLE_ADMIN' ou 'ADMIN')
            role: this.extractRole(payload),
          };

          localStorage.setItem(USER_KEY, JSON.stringify(user));
          this.currentUserSignal.set(user); // On met à jour le Signal Angular
        }
      }),
      catchError((err) => throwError(() => err)),
    );
  }

  // POST REGISTER
  register(userForm: RegisterForm): Observable<User> {
    return this.http.post<User>(this.registerUrl, userForm);
  }

  /**
   * Helper pour extraire proprement le rôle du JWT peu importe le format de Spring
   */
  private extractRole(payload: any): string {
    if (!payload) return 'LECTEUR';

    // Récupère la clé contenant le rôle (souvent 'role', 'roles', ou 'authorities')
    const rawRole = payload.role || payload.roles || payload.authorities || 'LECTEUR';

    // Si Spring envoie un tableau (ex: ["ROLE_ADMIN"]), on prend le premier
    const roleString = Array.isArray(rawRole) ? rawRole[0] : rawRole;

    // Nettoyage du préfixe "ROLE_" si Spring l'a ajouté
    return roleString.replace('ROLE_', '');
  }

  /**
   * Décode le payload d'un JWT sans vérifier la signature
   */
  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erreur lors du décodage du JWT', e);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN';
  }

  isLibraire(): boolean {
    const user = this.currentUser();
    return user?.role === 'BIBLIOTHECAIRE';
  }

  isUser(): boolean {
    const user = this.currentUser();
    return user?.role === 'LECTEUR' || user?.role === 'USER'; // S'adapte selon ton libellé exact
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeJwt(token);
    if (!payload) return false;
    return payload.exp > Date.now() / 1000;
  }

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

  // ═══════════════════════════════════════════════════
  //  GESTION UTILISATEURS (admin only)
  // ═══════════════════════════════════════════════════

  // GET Récupération des utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API.users, { headers: this.authHeaders() });
  }

  // PATCH changer le rôle d'un utilisateur
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

  // DELETE supprimer un utilisateur
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${API.users}/${userId}`, { headers: this.authHeaders() });
  }

  // GET consulter un profil
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${API.users}/${userId}`, { headers: this.authHeaders() });
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
    return role !== undefined;
  }

  /** Headers HTTP avec le token Bearer */
  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ═══════════════════════════════════════════════════
  //  GESTION DES RÔLE
  // ═══════════════════════════════════════════════════

  // GET Lister tous les rôles
  getRoles(): Observable<String[]> {
    return this.http.get<String[]>(this.apiRoleUrl, { headers: this.authHeaders() });
  }

  // POST Créer un nouveau rôle
  addRole(data: Omit<String, 'id'>): Observable<String> {
    return this.http.post<String>(this.apiRoleUrl, data, { headers: this.authHeaders() });
  }

  // GET Chercher un rôle by id
  getRoleById(id: number): Observable<String[]> {
    return this.http.get<String[]>(this.apiRoleUrl + '/' + id, { headers: this.authHeaders() });
  }

  // DELETE Chercher un rôle by id
  deleteRole(id: number): Observable<String[]> {
    return this.http.delete<String[]>(this.apiRoleUrl + '/' + id, { headers: this.authHeaders() });
  }

  // GET Chercher un rôle by name
  getRoleByName(name: string): Observable<String[]> {
    return this.http.get<String[]>(this.apiRoleUrl + '/searchByName/' + name, {
      headers: this.authHeaders(),
    });
  }

  // ═══════════════════════════════════════════════════
  //  HELPERS PRIVÉS
  // ═══════════════════════════════════════════════════
}
