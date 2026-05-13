import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/authentification.guard';
import { noAuthGuard } from './guards/no-authentification.guard';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { MySpaceComponent } from './pages/my-space/my-space-user/my-space.component';
import { MySpaceAdminComponent } from './pages/my-space/my-space-admin/my-space-admin.component';

export const routes: Routes = [
  // ── Publiques ──────────────────────────────────────
  { path: '', component: HomeComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'book/:id', component: BookDetailComponent },

  // ── Auth (bloqué si déjà connecté) ────────────────
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },

  // ── Rôle 1 : Utilisateur ───────────────────────────
  {
    path: 'mon-espace',
    component: MySpaceComponent,
    canActivate: [authGuard], // tout utilisateur connecté
  },

  // ── Rôle 2 : Libraire (accès emprunts + retards) ──
  {
    path: 'libraire',
    component: MySpaceAdminComponent,
    canActivate: [roleGuard(2)], // role >= 2
  },

  // ── Rôle 3 : Admin (accès total) ──────────────────
  {
    path: 'admin',
    component: MySpaceAdminComponent,
    canActivate: [roleGuard(3)], // role >= 3
  },

  // ── Page d'accès refusé ────────────────────────────
  {
    path: 'acces-refuse',
    loadComponent: () =>
      import('./pages/access-denied/access-denied.component').then((m) => m.AccessDeniedComponent),
  },

  // ── Fallback ───────────────────────────────────────
  { path: '**', redirectTo: '' },
];
