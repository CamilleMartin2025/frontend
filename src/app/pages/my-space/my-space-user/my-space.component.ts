import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class MySpaceComponent implements OnInit {
  editMode = false;
  renewSuccess: number | null = null;

  // TODO : get with api authentification
  user: User = {
    id: 1,
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.fr',
    phone: '06 12 34 56 78',
    birthDate: new Date('1990-04-15'),
    password: 'password',
    role: 1, // TODO 1 : lecteur, 2: bibli., 3: admin ?
  };

  userEdit: User = { ...this.user };
  loans: Loan[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // TODO Remplacer par LoanService.getMyLoans()
    this.loans = [
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
          date: new Date('2014-05-15'),
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
          date: new Date('2003-05-15'),
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
          date: new Date('2010-05-15'),
        },
        dueDate: new Date('2026-05-28'),
        daysLeft: 17,
        isLate: false,
      },
    ];
    this.cdr.detectChanges();
  }

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
    loan.isLate = false;
    this.loans = [...this.loans]; // force change detection
    this.renewSuccess = loan.id;
    setTimeout(() => {
      this.renewSuccess = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  onReturn(loan: Loan) {
    this.loans = this.loans.filter((l) => l.id !== loan.id);
  }

  onEditToggle() {
    this.userEdit = { ...this.user };
    this.editMode = true;
  }

  onSave() {
    this.user = { ...this.userEdit };
    this.editMode = false;
  }

  onCancel() {
    this.editMode = false;
  }

  bookColor(index: number): string {
    const colors = ['#4a90d9', '#5cb87a', '#e07b3a'];
    return colors[index % colors.length];
  }
}
