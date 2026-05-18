import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentification.service';
import { User } from '../../models/model';

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

    this.loginLoading = true;

    this.auth
      .login({
        email: this.loginEmail,
        password: this.loginPassword,
      })
      .subscribe({
        next: (user: User) => {
          console.log(user);

          this.loginLoading = false;
        },

        error: (err) => {
          this.loginError = err.error?.message ?? 'Erreur de connexion.';
          this.loginLoading = false;
        },
      });

    // Redirection selon le rôle
    if (this.auth.isAdmin()) this.router.navigate(['/admin']);
    else if (this.auth.isLibraire()) this.router.navigate(['/libraire']);
    else this.router.navigate(['/mon-espace']);
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

    this.registerLoading = true;

    this.auth
      .register({
        prenom: this.registerPrenom,
        nom: this.registerNom,
        email: this.registerEmail,
        password: this.registerPassword,
        tel: this.registerTelephone || undefined,
        date_naissance: this.registerDateNaissance || undefined,
      })
      .subscribe({
        next: (user: User) => {
          console.log(user);

          this.registerLoading = false;
        },

        error: (err) => {
          this.registerError = err.error?.message ?? "Erreur lors de l'inscription.";

          this.registerLoading = false;
        },
      });

    // Inscription réussie → redirection vers mon espace (role 1)
    this.router.navigate(['/mon-espace']);
  }
}
