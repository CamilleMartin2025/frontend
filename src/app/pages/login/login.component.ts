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

    const credentials = {
      email: this.loginEmail,
      password: this.loginPassword,
    };

    this.auth.login(credentials).subscribe({
      next: (response) => {
        this.loginLoading = false;
        console.log('Connexion validée ! Rôle de l’utilisateur :', this.auth.currentUser()?.role);

        // LA REDIRECTION SE FAIT ICI, UNE FOIS LE TOKEN REÇU ET TRAITÉ
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else if (this.auth.isLibraire()) {
          this.router.navigate(['/libraire']);
        } else {
          this.router.navigate(['/mon-espace']);
        }
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        this.loginError = 'Identifiants invalides ou serveur hors ligne.';
        this.loginLoading = false;
      },
    });
  }

  onRegister(): void {
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

    this.registerLoading = true;

    // Construction du DTO avec le nom EXACT attendu par Marine : dateDeNaissance
    const registrationPayload = {
      prenom: this.registerPrenom.trim(),
      nom: this.registerNom.trim(),
      email: this.registerEmail.trim(),
      password: this.registerPassword,
      dateDeNaissance: this.registerDateNaissance, // <-- LE CORREGIDOR ! "dateDeNaissance" avec le "De"
      roleId: 1,
    };

    // Ajout du téléphone s'il est présent
    if (this.registerTelephone && this.registerTelephone.trim() !== '') {
      // @ts-ignore
      registrationPayload.tel = this.registerTelephone.trim();
    }

    console.log("🚀 Envoi du payload d'inscription corrigé :", registrationPayload);

    this.auth.register(registrationPayload).subscribe({
      next: (user: User) => {
        console.log('🎉 Inscription validée en BDD !', user);
        this.registerLoading = false;
        this.registerSuccess = true;

        // Redirection vers l'espace membre
        this.router.navigate(['/mon-espace']);
      },
      error: (err) => {
        console.error('❌ Erreur serveur :', err);
        this.registerError =
          err.error?.message || "Erreur lors de l'inscription (vérifiez si l'email existe déjà).";
        this.registerLoading = false;
      },
    });
  }
}
