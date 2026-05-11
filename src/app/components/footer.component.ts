import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-name">BookHub</span>
          <p class="brand-tagline">La bibliothèque de<br />Quartier Solidaire</p>
          <div class="social-links">
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
                />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-nav">
          <div class="footer-col">
            <h4>Catalogue</h4>
            <a routerLink="/">Accueil</a>
            <a routerLink="/catalogue">Tous les livres</a>
            <a routerLink="/">Nouveautés</a>
          </div>
          <div class="footer-col">
            <h4>Mon compte</h4>
            <a routerLink="/mon-espace">Mon espace</a>
            <a routerLink="/mon-espace">Mes emprunts</a>
            <a routerLink="/login">Connexion</a>
          </div>
          <div class="footer-col">
            <h4>Association</h4>
            <a href="#">À propos</a>
            <a href="#">Événements</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Quartier Solidaire — BookHub</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--color-primary);
        color: rgba(255, 255, 255, 0.85);
        margin-top: 80px;
      }

      .footer-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 48px 24px 32px;
        display: flex;
        gap: 64px;
        flex-wrap: wrap;
      }

      .footer-brand {
        flex: 1;
        min-width: 180px;
      }

      .brand-name {
        font-family: var(--font-display);
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        display: block;
        margin-bottom: 8px;
      }

      .brand-tagline {
        font-size: 0.85rem;
        opacity: 0.65;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .social-links {
        display: flex;
        gap: 16px;
      }

      .social-links a {
        color: rgba(255, 255, 255, 0.6);
        transition: color var(--transition);
      }

      .social-links a:hover {
        color: #fff;
      }

      .footer-nav {
        display: flex;
        gap: 48px;
        flex-wrap: wrap;
      }

      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .footer-col h4 {
        font-family: var(--font-body);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 4px;
      }

      .footer-col a {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        transition: color var(--transition);
      }

      .footer-col a:hover {
        color: #fff;
      }

      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        padding: 16px 24px;
        font-size: 0.8rem;
        opacity: 0.4;
      }
    `,
  ],
})
export class FooterComponent {}
