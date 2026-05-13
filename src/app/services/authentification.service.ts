import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';
import { User, UserRole, LoginForm, RegisterForm } from '../models/book.model';

const TOKEN_KEY = 'bookhub_token';
const USER_KEY = 'bookhub_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  // Raccourcis pour la Navbar
  isUser = computed(() => this.currentUserSignal()?.role === 1);
  isLibraire = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 2 || role === 3;
  });
  isAdmin = computed(() => this.currentUserSignal()?.role === 3);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // --- CONNEXION ---
  // On adapte pour que le composant de Camille reçoive un objet avec {success, error}
  login(form: LoginForm): Observable<{ success: boolean; error?: string }> {
    return this.http.post<any>(`${this.apiUrl}/login`, form).pipe(
      map((response) => {
        const token = response.accessToken || response.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
          const user: User = {
            id: 0,
            firstName: '',
            lastName: '',
            email: form.email,
            role: 1,
            createdAt: new Date(),
          };
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          this.currentUserSignal.set(user);
          return { success: true };
        }
        return { success: false, error: 'Token non reçu' };
      }),
      catchError((err) => of({ success: false, error: 'Email ou mot de passe incorrect.' })),
    );
  }

  // --- INSCRIPTION ---
  register(form: RegisterForm): Observable<{ success: boolean; error?: string }> {
    const dto = {
      nom: form.lastName,
      prenom: form.firstName,
      email: form.email,
      password: form.password,
      tel: form.phone,
      dateDeNaissance: form.birthDate,
    };
    return this.http.post(`${this.apiUrl}/register`, dto).pipe(
      map(() => ({ success: true })),
      catchError((err) => of({ success: false, error: "Erreur lors de l'inscription." })),
    );
  }

  // --- FONCTIONS MANQUANTES (Pour les Guards et l'Admin) ---

  hasRole(minRole: UserRole): boolean {
    const role = this.currentUserSignal()?.role;
    return role ? role >= minRole : false;
  }

  hasExactRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  // Pour la page admin (on renvoie vide pour l'instant pour ne pas crash)
  getAllUsers(): User[] {
    return [];
  }
 
  updateUserRole(userId: number, newRole: UserRole): { success: boolean; error?: string } {
    return { success: true };
  }

  deleteUser(userId: number): { success: boolean; error?: string } {
    return { success: true };
  }
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private loadUserFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
