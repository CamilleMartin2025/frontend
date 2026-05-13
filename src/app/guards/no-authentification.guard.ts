import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentification.service';

/**
 * Guard inverse : empêche un utilisateur déjà connecté
 * d'accéder à /login ou /register.
 * Le redirige vers son espace selon son rôle.
 */
export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;

  // Déjà connecté → rediriger selon le rôle
  if (auth.isAdmin()) router.navigate(['/admin']);
  else if (auth.isLibraire()) router.navigate(['/libraire']);
  else router.navigate(['/mon-espace']);

  return false;
};
