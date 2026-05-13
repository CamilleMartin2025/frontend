import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authentification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="denied-wrapper">
      <p class="denied-icon">🔒</p>
      <h1 class="denied-title">Accès refusé</h1>
      <p class="denied-sub">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <div class="denied-actions">
        <a routerLink="/" class="btn-primary">Retour à l'accueil</a>
        <a *ngIf="!auth.isLoggedIn()" routerLink="/login" class="btn-secondary">Se connecter</a>
      </div>
    </div>
  `,
  styles: [
    `
      .denied-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 64px);
        text-align: center;
        gap: 14px;
        padding: 24px;
      }
      .denied-icon {
        font-size: 3rem;
      }
      .denied-title {
        font-family: var(--font-display);
        font-size: 2rem;
        font-weight: 700;
      }
      .denied-sub {
        color: var(--color-text-muted);
        max-width: 400px;
        line-height: 1.6;
      }
      .denied-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .btn-secondary {
        padding: 12px 28px;
        border-radius: var(--radius-sm);
        border: 1.5px solid var(--color-border);
        color: var(--color-text);
        font-weight: 500;
        font-size: 0.95rem;
        font-family: var(--font-body);
        cursor: pointer;
        transition: border-color var(--transition);
        text-decoration: none;
      }
      .btn-secondary:hover {
        border-color: var(--color-text);
      }
    `,
  ],
})
export class AccessDeniedComponent {
  constructor(public auth: AuthService) {}
}
