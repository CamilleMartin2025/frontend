import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Loan, User } from '../../models/book.model';

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

  // Temporaire avant lien BDD
  user: User = {
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.fr',
    phone: '06 12 34 56 78',
    birthDate: new Date('1990-04-15'),
  };

  // Temporaire avant lien BDD
  userEdit: User = { ...this.user };

  loans: Loan[] = [
    {
      id: 1,
      book: {
        id: 13,
        title: "L'Étranger",
        author: 'Albert Camus',
        cover: '',
        description: '',
        genre: ['Classique'],
        rating: 5,
        available: false,
      },
      dueDate: new Date('2026-05-15'),
      daysLeft: 3,
      isLate: false,
    },
    {
      id: 2,
      book: {
        id: 14,
        title: 'Dune',
        author: 'Frank Herbert',
        cover: '',
        description: '',
        genre: ['Science-fiction'],
        rating: 5,
        available: false,
      },
      dueDate: new Date('2026-05-01'),
      daysLeft: -11,
      isLate: true,
    },
    {
      id: 3,
      book: {
        id: 15,
        title: '1984',
        author: 'George Orwell',
        cover: '',
        description: '',
        genre: ['Classique', 'Dystopie'],
        rating: 5,
        available: false,
      },
      dueDate: new Date('2026-05-28'),
      daysLeft: 17,
      isLate: false,
    },
  ];

  getLoanStatus(loan: Loan): 'late' | 'urgent' | 'ok' {
    if (loan.isLate) return 'late';
    if (loan.daysLeft <= 5) return 'urgent';
    return 'ok';
  }

  getLoanLabel(loan: Loan): string {
    if (loan.isLate) return 'En retard';
    return `J-${loan.daysLeft}`;
  }

  onRenew(loan: Loan) {
    loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    loan.daysLeft += 14;
    this.renewSuccess = loan.id;
    setTimeout(() => (this.renewSuccess = null), 3000);
    // TODO: appel au LoanService
  }

  onReturn(loan: Loan) {
    this.loans = this.loans.filter((l) => l.id !== loan.id);
    // TODO: appel au LoanService
  }

  onEditToggle() {
    this.userEdit = { ...this.user };
    this.editMode = true;
  }

  onSave() {
    this.user = { ...this.userEdit };
    this.editMode = false;
    // TODO: appel au UserService
  }

  onCancel() {
    this.editMode = false;
  }

  bookColor(index: number): string {
    const colors = ['#4a90d9', '#5cb87a', '#e07b3a'];
    return colors[index % colors.length];
  }
}
