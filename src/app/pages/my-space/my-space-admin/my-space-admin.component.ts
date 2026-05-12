import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book, Loan, Review, User } from '../../../models/book.model';

type AdminTab = 'emprunts' | 'retards' | 'avis' | 'stats' | 'mon-espace';

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

  // ── Mon espace (identique à MySpaceComponent) ──
  editMode = false;
  renewSuccess: number | null = null;

  user: User = {
    id:0,
    firstName: 'Admin',
    lastName: 'Bibliothèque',
    email: 'admin@quartier-solidaire.fr',
    phone: '02 99 00 00 00',
    birthDate: new Date('1985-06-10'),
    password:'admin',
    role:3,
  };
  userEdit: User = { ...this.user };

  myLoans: Loan[] = [];

  // ── Demandes d'emprunts / prolongements ──
  requests: BorrowRequest[] = [];
  requestFilter: 'all' | 'emprunt' | 'prolongement' = 'all';

  // ── Retards ──
  lateReturns: LateReturn[] = [];

  // ── Avis à modérer ──
  reviews: AdminReview[] = [];
  reviewFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';

  // ── Stats ──
  stats: Stat[] = [];
  topRated: Book[] = [];
  topBorrowed: Book[] = [];
  genreStats: { genre: string; count: number; pct: number }[] = [];

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMyLoans();
    this.loadRequests();
    this.loadLateReturns();
    this.loadReviews();
    this.loadStats();
    this.cdr.detectChanges();
  }

  // ─────────────────────────────────────────
  //  MON ESPACE
  // ─────────────────────────────────────────
  private loadMyLoans(): void {
    const books = this.bookService.getAll();
    this.myLoans = [
      { id: 1, book: books[0], dueDate: new Date('2026-05-20'), daysLeft: 8, isLate: false },
      { id: 2, book: books[6], dueDate: new Date('2026-05-05'), daysLeft: -7, isLate: true },
    ];
  }

  getLoanStatus(loan: Loan): 'late' | 'urgent' | 'ok' {
    if (loan.isLate) return 'late';
    if (loan.daysLeft <= 5) return 'urgent';
    return 'ok';
  }

  getLoanLabel(loan: Loan): string {
    return loan.isLate ? 'En retard' : `J-${loan.daysLeft}`;
  }

  onRenewMyLoan(loan: Loan): void {
    loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 86400000);
    loan.daysLeft += 14;
    loan.isLate = false;
    this.myLoans = [...this.myLoans];
    this.renewSuccess = loan.id;
    setTimeout(() => {
      this.renewSuccess = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  onReturnMyLoan(loan: Loan): void {
    this.myLoans = this.myLoans.filter((l) => l.id !== loan.id);
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

  // ─────────────────────────────────────────
  //  DEMANDES
  // ─────────────────────────────────────────
  private loadRequests(): void {
    const books = this.bookService.getAll();
    this.requests = [
      {
        id: 1,
        user: 'Sophie Martin',
        book: books[1],
        type: 'emprunt',
        requestDate: new Date('2026-05-10'),
        status: 'pending',
      },
      {
        id: 2,
        user: 'Thomas Renard',
        book: books[13],
        type: 'emprunt',
        requestDate: new Date('2026-05-10'),
        status: 'pending',
      },
      {
        id: 3,
        user: 'Camille Leroy',
        book: books[4],
        type: 'prolongement',
        requestDate: new Date('2026-05-09'),
        currentDueDate: new Date('2026-05-12'),
        status: 'pending',
      },
      {
        id: 4,
        user: 'Marc Durand',
        book: books[6],
        type: 'emprunt',
        requestDate: new Date('2026-05-08'),
        status: 'approved',
      },
      {
        id: 5,
        user: 'Inès Kader',
        book: books[14],
        type: 'prolongement',
        requestDate: new Date('2026-05-07'),
        currentDueDate: new Date('2026-05-15'),
        status: 'approved',
      },
      {
        id: 6,
        user: 'Lucie Petit',
        book: books[2],
        type: 'emprunt',
        requestDate: new Date('2026-05-06'),
        status: 'rejected',
      },
      {
        id: 7,
        user: 'Antoine Vidal',
        book: books[16],
        type: 'emprunt',
        requestDate: new Date('2026-05-11'),
        status: 'pending',
      },
      {
        id: 8,
        user: 'Emma Bernard',
        book: books[3],
        type: 'prolongement',
        requestDate: new Date('2026-05-11'),
        currentDueDate: new Date('2026-05-20'),
        status: 'pending',
      },
    ];
  }

  get filteredRequests(): BorrowRequest[] {
    return this.requestFilter === 'all'
      ? this.requests
      : this.requests.filter((r) => r.type === this.requestFilter);
  }

  get pendingCount(): number {
    return this.requests.filter((r) => r.status === 'pending').length;
  }

  approveRequest(req: BorrowRequest): void {
    req.status = 'approved';
    this.requests = [...this.requests];
  }

  rejectRequest(req: BorrowRequest): void {
    req.status = 'rejected';
    this.requests = [...this.requests];
  }

  // ─────────────────────────────────────────
  //  RETARDS
  // ─────────────────────────────────────────
  private loadLateReturns(): void {
    const books = this.bookService.getAll();
    this.lateReturns = [
      {
        id: 1,
        user: 'Thomas Renard',
        userEmail: 'thomas.r@mail.fr',
        book: books[13],
        dueDate: new Date('2026-05-01'),
        daysLate: 11,
        reminderSent: true,
      },
      {
        id: 2,
        user: 'Lucie Petit',
        userEmail: 'lucie.p@mail.fr',
        book: books[5],
        dueDate: new Date('2026-04-28'),
        daysLate: 14,
        reminderSent: true,
      },
      {
        id: 3,
        user: 'Paul Morel',
        userEmail: 'paul.m@mail.fr',
        book: books[2],
        dueDate: new Date('2026-05-05'),
        daysLate: 7,
        reminderSent: false,
      },
      {
        id: 4,
        user: 'Élodie Faure',
        userEmail: 'elodie.f@mail.fr',
        book: books[10],
        dueDate: new Date('2026-05-08'),
        daysLate: 4,
        reminderSent: false,
      },
    ];
  }

  get lateCount(): number {
    return this.lateReturns.length;
  }

  sendReminder(late: LateReturn): void {
    late.reminderSent = true;
    this.lateReturns = [...this.lateReturns];
    // TODO: appel API email
  }

  markReturned(late: LateReturn): void {
    this.lateReturns = this.lateReturns.filter((l) => l.id !== late.id);
  }

  // ─────────────────────────────────────────
  //  AVIS
  // ─────────────────────────────────────────
  private loadReviews(): void {
    const books = this.bookService.getAll();
    this.reviews = [
      {
        id: 1,
        user: 'Sophie M.',
        book: books[0],
        title: 'Un classique incontournable',
        body: "Don Quichotte reste une lecture fascinante, pleine d'humour et de profondeur. Je recommande vivement !",
        rating: 5,
        date: new Date('2026-05-10'),
        status: 'pending',
      },
      {
        id: 2,
        user: 'Marc D.',
        book: books[6],
        title: 'Trop prévisible',
        body: "Honnêtement, j'ai trouvé l'intrigue assez cousue de fil blanc. Pas le meilleur McFadden.",
        rating: 2,
        date: new Date('2026-05-09'),
        status: 'pending',
      },
      {
        id: 3,
        user: 'Lucie P.',
        book: books[14],
        title: 'Orwell visionnaire',
        body: 'Relire 1984 en 2026 est saisissant. Chaque page résonne avec notre époque. Un must absolu.',
        rating: 5,
        date: new Date('2026-05-08'),
        status: 'pending',
      },
      {
        id: 4,
        user: 'Inès K.',
        book: books[3],
        title: 'Guide utile et drôle',
        body: "Facile m'a redonné le sourire. Des conseils concrets emballés dans un humour bienveillant.",
        rating: 4,
        date: new Date('2026-05-07'),
        status: 'approved',
      },
      {
        id: 5,
        user: 'Emma B.',
        book: books[1],
        title: 'Magique',
        body: "Alice est un voyage vers l'imaginaire pur. Lewis Carroll était un génie.",
        rating: 5,
        date: new Date('2026-05-06'),
        status: 'approved',
      },
      {
        id: 6,
        user: 'Paul M.',
        book: books[7],
        title: 'Contenu inapproprié !!',
        body: "Ce livre est une arnaque totale, l'auteur est un imposteur et ce roman ne devrait pas exister dans cette biblio !",
        rating: 1,
        date: new Date('2026-05-05'),
        status: 'rejected',
      },
    ];
  }

  get filteredReviews(): AdminReview[] {
    return this.reviewFilter === 'all'
      ? this.reviews
      : this.reviews.filter((r) => r.status === this.reviewFilter);
  }

  get pendingReviewCount(): number {
    return this.reviews.filter((r) => r.status === 'pending').length;
  }

  approveReview(review: AdminReview): void {
    review.status = 'approved';
    this.reviews = [...this.reviews];
  }

  rejectReview(review: AdminReview): void {
    review.status = 'rejected';
    this.reviews = [...this.reviews];
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  // ─────────────────────────────────────────
  //  STATISTIQUES
  // ─────────────────────────────────────────
  private loadStats(): void {
    const books = this.bookService.getAll();
    const available = books.filter((b) => b.available).length;
    const borrowed = books.length - available;

    this.stats = [
      { label: 'Livres total', value: books.length, icon: '📚' },
      {
        label: 'Disponibles',
        value: available,
        icon: '✅',
        sub: `${Math.round((available / books.length) * 100)}% du catalogue`,
      },
      {
        label: 'Empruntés',
        value: borrowed,
        icon: '📖',
        sub: `${Math.round((borrowed / books.length) * 100)}% du catalogue`,
      },
      { label: 'Retards en cours', value: 4, icon: '⏰', sub: 'livres non retournés' },
      { label: 'Emprunts ce mois', value: 27, icon: '📅', sub: '+12% vs mois dernier' },
      { label: 'Membres actifs', value: 43, icon: '👥', sub: 'sur 67 inscrits' },
      { label: 'Avis en attente', value: this.pendingReviewCount, icon: '💬' },
      { label: 'Demandes en attente', value: this.pendingCount, icon: '📋' },
    ];

    // Top 10 mieux notés
    this.topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 10);

    // Top 10 plus empruntés (simulé via ordre inverse d'id)
    this.topBorrowed = [...books]
      .sort((a, b) => (b.available ? 0 : 1) - (a.available ? 0 : 1) || b.rating - a.rating)
      .slice(0, 10);

    // Répartition par genre
    const genreMap = new Map<string, number>();
    books.forEach((b) => b.genre.forEach((g) => genreMap.set(g, (genreMap.get(g) ?? 0) + 1)));
    const total = [...genreMap.values()].reduce((s, v) => s + v, 0);
    this.genreStats = [...genreMap.entries()]
      .map(([genre, count]) => ({ genre, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }

  setTab(tab: AdminTab): void {
    this.activeTab = tab;
  }
}
