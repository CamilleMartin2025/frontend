import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authentification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-brand">BookHub</a>

        <div class="navbar-links">
          <a routerLink="/catalogue" routerLinkActive="active">Catalogue</a>

          <!-- Connecté -->
          <ng-container *ngIf="auth.isLoggedIn()">
            <!-- Lien espace selon rôle -->
            <a *ngIf="auth.isAdmin()" routerLink="/admin" routerLinkActive="active"
              >Administration</a
            >
            <a
              *ngIf="auth.isLibraire() && !auth.isAdmin()"
              routerLink="/libraire"
              routerLinkActive="active"
              >Espace libraire</a
            >
            <a *ngIf="auth.isUser()" routerLink="/mon-espace" routerLinkActive="active"
              >Mon espace</a
            >

            <!-- Nom + déconnexion -->
            <div class="user-menu">
              <span class="user-greeting">
                {{ auth.currentUser()?.prenom }}
                <span class="role-badge" [class]="'role-' + auth.currentUser()?.role">
                  {{ getRoleLabel() }}
                </span>
              </span>
              <button class="btn-logout" (click)="auth.logout()">Déconnexion</button>
            </div>
          </ng-container>

          <!-- Non connecté -->
          <a *ngIf="!auth.isLoggedIn()" routerLink="/login" class="btn-connexion">Connexion</a>
        </div>

        <!-- Hamburger mobile -->
        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Menu mobile -->
      <div class="mobile-menu" [class.open]="menuOpen">
        <a routerLink="/catalogue" (click)="menuOpen = false">Catalogue</a>

        <ng-container *ngIf="auth.isLoggedIn()">
          <a *ngIf="auth.isAdmin()" routerLink="/admin" (click)="menuOpen = false"
            >Administration</a
          >
          <a
            *ngIf="auth.isLibraire() && !auth.isAdmin()"
            routerLink="/libraire"
            (click)="menuOpen = false"
            >Espace libraire</a
          >
          <a *ngIf="auth.isUser()" routerLink="/mon-espace" (click)="menuOpen = false"
            >Mon espace</a
          >
          <button class="btn-logout-mobile" (click)="auth.logout(); menuOpen = false">
            Déconnexion
          </button>
        </ng-container>

        <a *ngIf="!auth.isLoggedIn()" routerLink="/login" (click)="menuOpen = false">Connexion</a>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        height: 64px;
      }

      .navbar-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .navbar-brand {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--color-text);
      }

      .navbar-links {
        display: flex;
        align-items: center;
        gap: 28px;
      }

      .navbar-links > a {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--color-text-muted);
        transition: color var(--transition);
        text-decoration: none;
      }

      .navbar-links > a:hover,
      .navbar-links > a.active {
        color: var(--color-text);
      }

      /* Menu utilisateur connecté */
      .user-menu {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .user-greeting {
        font-size: 0.88rem;
        font-weight: 500;
        color: var(--color-text);
        display: flex;
        align-items: center;
        gap: 7px;
      }

      /* Badge rôle */
      .role-badge {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 2px 8px;
        border-radius: var(--radius-pill);
      }

      .role-1 {
        background: #e8f0fe;
        color: #3a5fa8;
      } /* user  → bleu  */
      .role-2 {
        background: #fef6e4;
        color: var(--color-warning);
      } /* libraire → orange */
      .role-3 {
        background: #fdecea;
        color: var(--color-accent);
      } /* admin → rouge */

      .btn-logout {
        background: none;
        border: 1.5px solid var(--color-border);
        color: var(--color-text-muted);
        padding: 7px 14px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        font-weight: 500;
        font-family: var(--font-body);
        cursor: pointer;
        transition: all var(--transition);
      }

      .btn-logout:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      .btn-connexion {
        background: var(--color-primary) !important;
        color: #fff !important;
        padding: 8px 20px;
        border-radius: var(--radius-sm);
        font-weight: 500 !important;
        transition: opacity var(--transition) !important;
        text-decoration: none;
      }

      .btn-connexion:hover {
        opacity: 0.8;
      }

      /* Hamburger */
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
      }

      .hamburger span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--color-text);
        border-radius: 2px;
        transition: all 0.3s;
      }

      /* Mobile menu */
      .mobile-menu {
        display: none;
        flex-direction: column;
        background: var(--color-surface);
        border-top: 1px solid var(--color-border);
        padding: 12px 24px;
        gap: 4px;
      }

      .mobile-menu.open {
        display: flex;
      }

      .mobile-menu a {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-text-muted);
        padding: 10px 0;
        text-decoration: none;
      }

      .btn-logout-mobile {
        background: none;
        border: none;
        font-family: var(--font-body);
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-accent);
        padding: 10px 0;
        cursor: pointer;
        text-align: left;
      }

      @media (max-width: 768px) {
        .navbar-links {
          display: none;
        }
        .hamburger {
          display: flex;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  menuOpen = false;

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  getRoleLabel(): string {
    const role = this.auth.currentUser()?.role;
    if (role === 3) return 'Admin';
    if (role === 2) return 'Libraire';
    return 'Membre';
  }
}
