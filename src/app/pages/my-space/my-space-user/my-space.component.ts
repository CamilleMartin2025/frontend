import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Loan, LoanView, User } from '../../../models/model';
import { LoanService } from '../../../services/loan.service';
import { AuthService } from '../../../services/authentification.service';
import { switchMap, Observable, map } from 'rxjs';

@Component({
  selector: 'app-my-space',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-space.component.html',
  styleUrl: './my-space.component.css',
})
export class MySpaceComponent {
  editMode = false;
  renewSuccess: number | null = null;
  renewError = '';

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
  ) {}

  user!: User;
  userEdit!: User;

  // Typé LoanView → toutes les propriétés calculées disponibles dans le template
  loans$!: Observable<LoanView[]>;
  loansLoading = true;

  // Propriété pour comparaison de dates dans le template
  today = new Date();

  ngOnInit(): void {
   const current = this.authService.currentUser();
    if (current) {
      this.user = { ...current };
      this.userEdit = { ...current };
    } else {
      // Sécurité au cas où l'utilisateur n'est pas chargé pour éviter le crash du template
      this.user = { id: 0, prenom: 'Utilisateur', nom: '', email: '', role: "LECTEUR" };
      this.userEdit = { ...this.user };
    }

    this.loansLoading = true;

    this.loans$ = this.loanService.getViewsByUserId();
  }

  // ── Statut badge ────────────────────────────────────
  getLoanStatus(loan: LoanView): 'late' | 'urgent' | 'ok' {
    if (loan.isLate) return 'late';
    if (loan.daysLeft <= 5) return 'urgent';
    return 'ok';
  }

  getLoanLabel(loan: LoanView): string {
    if (loan.isLate) return 'En retard';
    return `J-${loan.daysLeft}`;
  }

  // ── Actions emprunts ────────────────────────────────
  onRenew(loan: LoanView): void {
      this.loanService
        .renew(loan.id)
        .pipe(
          switchMap((updated) => this.loanService.enrich(updated))
        )
        .subscribe({
          next: (enriched) => {
            this.loans$ = this.loans$.pipe(
              map(loansList => loansList.map(l => l.id === loan.id ? enriched : l))
            );
            this.renewSuccess = loan.id;
            setTimeout(() => (this.renewSuccess = null), 3000);
          },
          error: (err) => {
            this.renewError = err.message ?? 'Erreur lors du renouvellement.';
            setTimeout(() => (this.renewError = ''), 4000);
          },
        });
    }

  onReturn(loan: LoanView): void {
    this.loanService.return(loan.id).subscribe({
      next: () => {
        this.loans$ = this.loans$.pipe(
          map(loansList => loansList.filter(l => l.id !== loan.id))
        );
      },
      error: (err) => console.error('Erreur retour :', err),
    });
  }

  // ── Profil ───────────────────────────────────────────
  onEditToggle(): void {
    this.userEdit = { ...this.user };
    this.editMode = true;
  }

  onSave(): void {
    this.authService.updateProfile(this.userEdit).subscribe({
      next: (updated) => {
        this.user = { ...updated };
        this.editMode = false;
      },
      error: (err) => console.error('Erreur mise à jour profil :', err),
    });
  }

  onCancel(): void {
    this.editMode = false;
  }

  bookColor(i: number): string {
    return ['#4a90d9', '#5cb87a', '#e07b3a'][i % 3];
  }

  protected readonly Date = Date;
}
