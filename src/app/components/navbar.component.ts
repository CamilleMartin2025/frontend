import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

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
          <a routerLink="/mon-espace" routerLinkActive="active">Mon espace</a>
          <a routerLink="/login" class="btn-connexion">Connexion</a>
        </div>
        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <!-- Mobile menu -->
      <div class="mobile-menu" [class.open]="menuOpen">
        <a routerLink="/catalogue" (click)="menuOpen = false">Catalogue</a>
        <a routerLink="/mon-espace" (click)="menuOpen = false">Mon espace</a>
        <a routerLink="/login" (click)="menuOpen = false">Connexion</a>
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
        gap: 32px;
      }

      .navbar-links a {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--color-text-muted);
        transition: color var(--transition);
      }

      .navbar-links a:hover,
      .navbar-links a.active {
        color: var(--color-text);
      }

      .btn-connexion {
        background: var(--color-primary) !important;
        color: #fff !important;
        padding: 8px 20px;
        border-radius: var(--radius-sm);
        font-weight: 500 !important;
        transition: opacity var(--transition) !important;
      }

      .btn-connexion:hover {
        opacity: 0.8;
      }

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

      .mobile-menu {
        display: none;
        flex-direction: column;
        background: var(--color-surface);
        border-top: 1px solid var(--color-border);
        padding: 12px 24px;
        gap: 12px;
      }

      .mobile-menu.open {
        display: flex;
      }

      .mobile-menu a {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-text-muted);
        padding: 8px 0;
      }

      @media (max-width: 640px) {
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
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
