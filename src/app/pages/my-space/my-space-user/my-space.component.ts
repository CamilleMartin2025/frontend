import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Loan, User } from '../../../models/model';
import { LoanService } from '../../../services/loan.service';

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

  constructor(private loanService: LoanService) {}

  user: User = {
    id: 0,
    role: 1,
    prenom: 'Marie',
    nom: 'Dupont',
    email: 'marie.dupont@email.fr',
    tel: '06 12 34 56 78',
    date_naissance: new Date('1990-04-15'),
  };

  userEdit: User = { ...this.user };

  // @ts-ignore
  loans: [];

  ngOnInit(): void {
    this.loans = [];
    this.loanService.getByUserId(this.user.id).subscribe({
      next: (data) => {
        // @ts-ignore
        this.loans = data || [];
      },
      error: (err) => {
        console.error(err);
        this.loans = [];
      },
    });
  }

  getLoanStatus(loan: Loan): 'late' | 'urgent' | 'ok' {
    const now = new Date().getTime();
    const due = new Date(loan.date_retour_prevu).getTime();

    if (due < now) return 'late';

    const diffDays = (due - now) / (1000 * 60 * 60 * 24);

    if (diffDays <= 5) return 'urgent';

    return 'ok';
  }

  getLoanLabel(loan: Loan): string {
    let isLate = false;
    const now = new Date().getTime();
    const due = new Date(loan.date_retour_prevu).getTime();
    if (due < now) {
      isLate = true;
    }
    const diffDays = (due - now) / (1000 * 60 * 60 * 24);
    if (this.getLoanStatus(loan) == 'late') {
      return isLate ? 'En retard' : `J-${diffDays}`;
    }
    return '';
  }

  onRenew(loan: Loan): void {
    loan.date_retour_prevu = new Date(loan.date_retour_prevu.getTime() + 14 * 86400000);
    this.loans = [...this.loans]; // nouveau tableau → Angular détecte le changement
    this.renewSuccess = loan.id;
    setTimeout(() => (this.renewSuccess = null), 3000);
  }

  onReturn(loan: Loan): void {
    // @ts-ignore
    this.loans = this.loans.filter((l) => l.id !== loan.id);
  }

  onEditToggle(): void {
    this.userEdit = { ...this.user };
    this.editMode = true;
  }
  onSave(): void {
    this.user = { ...this.userEdit };
    this.editMode = false;
  }
  onCancel(): void {
    this.editMode = false;
  }

  bookColor(i: number): string {
    return ['#4a90d9', '#5cb87a', '#e07b3a'][i % 3];
  }

  protected readonly Date = Date;
}
