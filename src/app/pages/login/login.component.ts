import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Formulaire Connexion
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  loginLoading = false;

  // Formulaire Inscription
  registerNom = '';
  registerPrenom = '';
  registerEmail = '';
  registerTelephone = '';
  registerDateNaissance = '';
  registerPassword = '';
  registerError = '';
  registerSuccess = false;
  registerLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onLogin(): void {
    this.loginError = '';
    this.loginLoading = true;

    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Veuillez remplir tous les champs.';
      this.loginLoading = false;
      return;
    }

    // Changement ici : on s'abonne à l'appel API
    this.auth
      .login({
        email: this.loginEmail,
        password: this.loginPassword,
      })
      .subscribe({
        next: (result) => {
          this.loginLoading = false;
          if (result.success) {
            // Redirection selon le rôle une fois connecté
            if (this.auth.isAdmin()) this.router.navigate(['/admin']);
            else if (this.auth.isLibraire()) this.router.navigate(['/libraire']);
            else this.router.navigate(['/mon-espace']);
          } else {
            this.loginError = result.error ?? 'Erreur de connexion.';
          }
        },
        error: () => {
          this.loginLoading = false;
          this.loginError = 'Erreur technique avec le serveur.';
        },
      });
  }

  onRegister(): void {
    this.registerError = '';
    this.registerSuccess = false;
    this.registerLoading = true;

    if (
      !this.registerNom ||
      !this.registerPrenom ||
      !this.registerEmail ||
      !this.registerPassword
    ) {
      this.registerError = 'Veuillez remplir tous les champs obligatoires (*).';
      this.registerLoading = false;
      return;
    }   

    // Changement ici aussi : on s'abonne à l'inscription
    this.auth
      .register({
        firstName: this.registerPrenom,
        lastName: this.registerNom,
        email: this.registerEmail,
        password: this.registerPassword,
        phone: this.registerTelephone || undefined,
        birthDate: this.registerDateNaissance || undefined,
      })
      .subscribe({
        next: (result) => {
          this.registerLoading = false;
          if (result.success) {
            this.router.navigate(['/mon-espace']);
          } else {
            this.registerError = result.error ?? "Erreur lors de l'inscription.";
          }
        },
        error: () => {
          this.registerLoading = false;
          this.registerError = 'Le serveur ne répond pas.';
        },
      });
  }
}
