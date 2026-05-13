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

    const result = this.auth.login({
      email: this.loginEmail,
      password: this.loginPassword,
    });

    this.loginLoading = false;

    if (!result.success) {
      this.loginError = result.error ?? 'Erreur de connexion.';
      return;
    }

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

    const result = this.auth.register({
      firstName: this.registerPrenom,
      lastName: this.registerNom,
      email: this.registerEmail,
      password: this.registerPassword,
      phone: this.registerTelephone || undefined,
      birthDate: this.registerDateNaissance || undefined,
    });

    this.registerLoading = false;

    if (!result.success) {
      this.registerError = result.error ?? "Erreur lors de l'inscription.";
      return;
    }

    // Inscription réussie → redirection vers mon espace (role 1)
    this.router.navigate(['/mon-espace']);
  }
}
