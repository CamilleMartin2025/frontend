import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  // Formulaire Inscription
  registerNom = '';
  registerPrenom = '';
  registerEmail = '';
  registerTelephone = '';
  registerDateNaissance = '';
  registerPassword = '';
  registerError = '';
  registerSuccess = false;

  constructor(private router: Router) {}

  onLogin() {
    this.loginError = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Veuillez remplir tous les champs.';
      return;
    }
    // TODO: connecter au service d'authentification
    console.log('Connexion avec :', this.loginEmail);
    this.router.navigate(['/mon-espace']);
  }

  onRegister() {
    this.registerError = '';
    this.registerSuccess = false;

    if (
      !this.registerNom ||
      !this.registerPrenom ||
      !this.registerEmail ||
      !this.registerPassword ||
      !this.registerDateNaissance
    ) {
      this.registerError = 'Veuillez remplir tous les champs obligatoires (*).';
      return;
    }
    // TODO: connecter au service d'authentification
    console.log('Inscription de :', this.registerEmail);
    this.registerSuccess = true;
  }
}
