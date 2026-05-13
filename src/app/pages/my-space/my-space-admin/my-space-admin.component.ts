import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/authentification.service';
import { Book, Loan, User, UserRole, ROLE_LABELS } from '../../../models/book.model';

type AdminTab =
  | 'emprunts'
  | 'retards'
  | 'avis'
  | 'stats'
  | 'catalogue'
  | 'utilisateurs'
  | 'mon-espace';

// Interfaces locales (gardées telles quelles pour la cohérence de Camille)
interface BorrowRequest {
  id: number;
  user: string;
  book: Book;
  type: 'emprunt' | 'prolongement';
  requestDate: Date;
  currentDueDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
}
interface LateReturn {
  id: number;
  user: string;
  userEmail: string;
  book: Book;
  dueDate: Date;
  daysLate: number;
  reminderSent: boolean;
}
interface AdminReview {
  id: number;
  user: string;
  book: Book;
  title: string;
  body: string;
  rating: number;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}
interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
}

@Component({
  selector: 'app-my-space-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-space-admin.component.html',
  styleUrl: './my-space-admin.component.css',
})
export class MySpaceAdminComponent implements OnInit {
  activeTab: AdminTab = 'emprunts';
  editMode = false;
  renewSuccess: number | null = null;

  // Initialisé avec des données vides, sera rempli par le service
  user: User = {
    id: 0,
    firstName: 'Admin',
    lastName: 'Bibliothèque',
    email: '',
    role: 3,
    createdAt: new Date(),
  };
  userEdit: User = { ...this.user };

  myLoans: Loan[] = [];
  requests: BorrowRequest[] = [];
  requestFilter: 'all' | 'emprunt' | 'prolongement' = 'all';
  lateReturns: LateReturn[] = [];
  reviews: AdminReview[] = [];
  reviewFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';
  stats: Stat[] = [];
  topRated: Book[] = [];
  topBorrowed: Book[] = [];
  genreStats: { genre: string; count: number; pct: number }[] = [];

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // On récupère le vrai utilisateur connecté
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user = currentUser;
      this.userEdit = { ...this.user };
    }

    this.loadMyLoans();
    this.loadRequests();
    this.loadLateReturns();
    this.loadReviews();
    this.loadStats();
    this.loadCatalogue();
    this.loadUsers();
    this.cdr.detectChanges();
  }

  // ─────────────────────────────────────────
  //  LOGIQUE UTILISATEURS (CORRIGÉE)
  // ─────────────────────────────────────────
  users: User[] = [];
  userSearch = '';
  userSuccess = '';
  userError = '';
  roleLabels = ROLE_LABELS;
  roleOptions: UserRole[] = [1, 2, 3];

  get filteredUsers(): User[] {
    const q = this.userSearch.toLowerCase();
    return this.users.filter(
      (u) =>
        !q ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }

  private loadUsers(): void {
    this.users = this.authService.getAllUsers();
  }

  onRoleChange(user: User, event: Event): void {
    const newRole = Number((event.target as HTMLSelectElement).value) as UserRole;
    const result = this.authService.updateUserRole(user.id, newRole);

    if (result.success) {
      this.loadUsers();
      this.userSuccess = `Rôle de ${user.firstName} mis à jour.`;
      setTimeout(() => (this.userSuccess = ''), 3000);
    } else {
      this.userError = result.error || 'Erreur lors de la modification.';
      setTimeout(() => (this.userError = ''), 4000);
    }
  }

  onDeleteUser(user: User): void {
    if (confirm(`Supprimer le compte de ${user.firstName} ?`)) {
      const result = this.authService.deleteUser(user.id);
      if (result.success) {
        this.loadUsers();
        this.userSuccess = `Utilisateur supprimé.`;
        setTimeout(() => (this.userSuccess = ''), 3000);
      } else {
        this.userError = result.error || 'Suppression impossible.';
        setTimeout(() => (this.userError = ''), 4000);
      }
    }
  }

  // ── Méthodes de chargement simulées (gardées pour ne pas casser le visuel) ──
  private loadMyLoans(): void {
    /* ... code de Camille ... */
  }
  private loadRequests(): void {
    /* ... code de Camille ... */
  }
  private loadLateReturns(): void {
    /* ... code de Camille ... */
  }
  private loadReviews(): void {
    /* ... code de Camille ... */
  }
  private loadStats(): void {
    /* ... code de Camille ... */
  }
  private loadCatalogue(): void {
    this.catalogueBooks = this.bookService.getAll();
  }

  // ── Méthodes UI ──
  setTab(tab: AdminTab): void {
    this.activeTab = tab;
  }
  getRoleBadgeClass(role: UserRole): string {
    return `role-badge role-${role}`;
  }
  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  // (Copie ici les méthodes onAddBook, onDeleteBook, etc. si tu en as besoin,
  // elles n'utilisent pas le AuthService donc elles ne posent pas de problème)
  catalogueBooks: Book[] = [];
  showAddForm = false;
  deleteConfirmId: number | null = null;
  catalogueSuccess = '';
  catalogueError = '';
  newBook: Omit<Book, 'id'> = {
    title: '',
    author: '',
    cover: '',
    description: '',
    genre: [],
    rating: 0,
    available: true,
    date: new Date(),
  };
  newBookGenresRaw = '';
  onAddBook(): void {
    /* ... */
  }
  onDeleteBook(id: number): void {
    /* ... */
  }
  toggleAvailability(book: Book): void {
    /* ... */
  }
  private resetNewBook(): void {
    /* ... */
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
  getLoanStatus(loan: Loan): 'late' | 'urgent' | 'ok' {
    return loan.isLate ? 'late' : loan.daysLeft <= 5 ? 'urgent' : 'ok';
  }
  getLoanLabel(loan: Loan): string {
    return loan.isLate ? 'En retard' : `J-${loan.daysLeft}`;
  }
  onRenewMyLoan(loan: Loan): void {
    /* ... */
  }
  onReturnMyLoan(loan: Loan): void {
    this.myLoans = this.myLoans.filter((l) => l.id !== loan.id);
  }
  approveRequest(req: BorrowRequest): void {
    req.status = 'approved';
  }
  rejectRequest(req: BorrowRequest): void {
    req.status = 'rejected';
  }
  sendReminder(late: LateReturn): void {
    late.reminderSent = true;
  }
  markReturned(late: LateReturn): void {
    this.lateReturns = this.lateReturns.filter((l) => l.id !== late.id);
  }
  approveReview(review: AdminReview): void {
    review.status = 'approved';
  }
  rejectReview(review: AdminReview): void {
    review.status = 'rejected';
  }
  get filteredRequests(): BorrowRequest[] {
    return this.requestFilter === 'all'
      ? this.requests
      : this.requests.filter((r) => r.type === this.requestFilter);
  }
  get pendingCount(): number {
    return this.requests.filter((r) => r.status === 'pending').length;
  }
  get lateCount(): number {
    return this.lateReturns.length;
  }
  get filteredReviews(): AdminReview[] {
    return this.reviewFilter === 'all'
      ? this.reviews
      : this.reviews.filter((r) => r.status === this.reviewFilter);
  }
  get pendingReviewCount(): number {
    return this.reviews.filter((r) => r.status === 'pending').length;
  }
}
