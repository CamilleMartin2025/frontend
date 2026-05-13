import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentification.service';
import { UserRole } from '../models/book.model';

/**
 * Guard de base : vérifie que l'utilisateur est connecté.
 * Redirige vers /login si non authentifié.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};

/**
 * Guard par rôle minimum : vérifie que l'utilisateur a au moins le rôle requis.
 * Usage : canActivate: [roleGuard(2)]  → libraire ou admin
 */
export const roleGuard = (minRole: UserRole): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.hasRole(minRole)) return true;

    // Connecté mais pas le bon rôle → redirection selon son rôle
    router.navigate(['/acces-refuse']);
    return false;
  };
};

/**
 * Guard rôle exact : vérifie que l'utilisateur a exactement ce rôle.
 * Exemple d'usage : canActivate: [exactRoleGuard(2)]
 */
export const exactRoleGuard = (role: UserRole): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.hasExactRole(role)) return true;

    router.navigate(['/acces-refuse']);
    return false;
  };
};
