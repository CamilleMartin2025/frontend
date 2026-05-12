import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { MySpaceComponent } from './pages/my-space/my-space-user/my-space.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { MySpaceAdminComponent } from './pages/my-space/my-space-admin/my-space-admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'mon-espace', component: MySpaceComponent },
  { path: 'mon-espace/admin', component: MySpaceAdminComponent },
  { path: '**', redirectTo: '' },
];
