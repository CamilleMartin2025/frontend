import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Loan, User } from '../../../models/book.model';

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

  user: User = {
    createdAt: new Date(),
    id: 0,
    role: 1,
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.fr',
    phone: '06 12 34 56 78',
    birthDate: new Date('1990-04-15')
  };

  userEdit: User = { ...this.user };

  // Données initialisées directement (pas dans ngOnInit) → pas de double cycle
  loans: Loan[] = [
    {
      id: 1,
      book: {
        id: 13,
        title: "L'Étranger",
        author: 'Albert Camus',
        cover: 'https://m.media-amazon.com/images/I/41pFLMkOqhL.jpg',
        description: '',
        genre: ['Classique'],
        rating: 5,
        available: false,
        date: new Date(),
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
        cover: 'https://m.media-amazon.com/images/I/81ym3QUd3KL.jpg',
        description: '',
        genre: ['Science-fiction'],
        rating: 5,
        available: false,
        date: new Date(),
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
        cover: 'https://m.media-amazon.com/images/I/71kxa2iBsNL.jpg',
        description: '',
        genre: ['Classique', 'Dystopie'],
        rating: 5,
        available: false,
        date: new Date(),
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
    return loan.isLate ? 'En retard' : `J-${loan.daysLeft}`;
  }

  onRenew(loan: Loan): void {
    loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 86400000);
    loan.daysLeft += 14;
    loan.isLate = false;
    this.loans = [...this.loans]; // nouveau tableau → Angular détecte le changement
    this.renewSuccess = loan.id;
    setTimeout(() => (this.renewSuccess = null), 3000);
  }

  onReturn(loan: Loan): void {
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
}
