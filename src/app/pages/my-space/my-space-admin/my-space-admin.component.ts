import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/authentification.service';
import { Book, Loan, Review, User, UserRole, ROLE_LABELS, LoanView } from '../../../models/model';
import { Observable, switchMap } from 'rxjs';
import { LoanService } from '../../../services/loan.service';

type AdminTab = 'emprunts' | 'retards' | 'avis' | 'stats' | 'catalogue' | 'utilisateurs' | 'mon-espace';

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
  renewError = '';

  user!: User;
  userEdit!: User;

  // Typé LoanView → toutes les propriétés calculées disponibles dans le template
  loans: LoanView[] = [];
  loansLoading = true;

  // Propriété pour comparaison de dates dans le template
  today = new Date();

  books!: Book[];

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
  topRated!: Book[];
  topBorrowed!: Book[];
  genreStats: { genre: string; count: number; pct: number }[] = [];

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const current = this.authService.currentUser();
    if (current) {
      this.user = { ...current };
      this.userEdit = { ...current };
    }
    // Charger les emprunts enrichis de l'utilisateur connecté
    // @ts-ignore
    this.loanService.getViewsByUserId(current.id).subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loansLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement emprunts :', err);
        this.loansLoading = false;
      },
    });
    this.loadRequests();
    this.loadLateReturns();
    this.loadReviews();
    this.loadStats();
    this.loadCatalogue();
    this.loadUsers();
    this.cdr.detectChanges();
  }

  // ─────────────────────────────────────────
  //  MON ESPACE
  // ─────────────────────────────────────────

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
        // enrich() est async → on enchaîne avec switchMap
        switchMap((updated) => this.loanService.enrich(updated)),
      )
      .subscribe({
        next: (enriched) => {
          this.loans = this.loans.map((l) => (l.id === loan.id ? enriched : l));
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
        this.loans = this.loans.filter((l) => l.id !== loan.id);
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

  // ─────────────────────────────────────────
  //  DEMANDES
  // ─────────────────────────────────────────
  private loadRequests(): void {
    this.bookService.getAll().subscribe((books) => {
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
    });
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
    this.bookService.getAll().subscribe((books) => {
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
    });
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
    this.bookService.getAll().subscribe((books) => {
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
    });
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
    this.bookService.getAll().subscribe((books) => {
      const available = books.filter((b) => b.quantite > 0).length;
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

        {
          label: 'Retards en cours',
          value: 4,
          icon: '⏰',
          sub: 'livres non retournés',
        },

        {
          label: 'Emprunts ce mois',
          value: 27,
          icon: '📅',
          sub: '+12% vs mois dernier',
        },

        {
          label: 'Membres actifs',
          value: 43,
          icon: '👥',
          sub: 'sur 67 inscrits',
        },

        {
          label: 'Avis en attente',
          value: this.pendingReviewCount,
          icon: '💬',
        },

        {
          label: 'Demandes en attente',
          value: this.pendingCount,
          icon: '📋',
        },
      ];

      // Top 10 mieux notés
      this.topRated = [...books].sort((a, b) => b.note - a.note).slice(0, 10);

      // Top 10 plus empruntés
      this.topBorrowed = [...books]
        .sort((a, b) => (b.quantite ? 0 : 1) - (a.quantite ? 0 : 1) || b.note - a.note)
        .slice(0, 10);

      // Répartition par genre
      const genreMap = new Map<string, number>();

      books.forEach((b) => b.categorie.forEach((g) => genreMap.set(g, (genreMap.get(g) ?? 0) + 1)));

      const total = [...genreMap.values()].reduce((s, v) => s + v, 0);

      this.genreStats = [...genreMap.entries()]
        .map(([genre, count]) => ({
          genre,
          count,
          pct: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count);
    });
  }

  setTab(tab: AdminTab): void {
    this.activeTab = tab;
  }

  // ─────────────────────────────────────────
  //  CATALOGUE (libraire & admin)
  // ─────────────────────────────────────────
  catalogueBooks: Book[] = [];
  showAddForm = false;
  deleteConfirmId: number | null = null;
  catalogueSuccess = '';
  catalogueError = '';

  newBook: Omit<Book, 'id'> = {
    titre: '',
    auteur: '',
    resume: '',
    categorie: [],
    note: 0,
    quantite: 0,
    date_ajout: new Date('2026-05-05'),
    isbn: '',
  };
  newBookGenresRaw = ''; // saisie libre séparée par virgules

  private loadCatalogue(): void {
    this.bookService.getAll().subscribe((books) => {
      this.catalogueBooks = books;
    });
  }

  onAddBook(): void {
    this.catalogueError = '';

    if (!this.newBook.titre.trim() || !this.newBook.auteur.trim()) {
      this.catalogueError = 'Titre et auteur sont obligatoires.';
      return;
    }

    const genres = this.newBookGenresRaw
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    this.bookService.addBook({ ...this.newBook, categorie: genres }).subscribe((book) => {
      // message succès avec vrai Book
      this.catalogueSuccess = `"${book.titre}" ajouté avec succès.`;

      // reload catalogue
      this.bookService.getAll().subscribe((books) => {
        this.catalogueBooks = books;
      });

      this.showAddForm = false;
      this.resetNewBook();

      setTimeout(() => (this.catalogueSuccess = ''), 4000);
    });
  }

  onDeleteBook(id: number): void {
    this.bookService.deleteBook(id);
    this.bookService.getAll().subscribe((books) => {
      this.catalogueBooks = books;
    });
    this.deleteConfirmId = null;
  }

  //  TODO change to setQuantity with +1 or -1 if returned or borrowed
  setBorrowQuantity(book: Book): void {
    if (book.quantite > 0) {
      book.quantite = book.quantite - 1;
    }
  }

  setReturnQuantity(book: Book): void {
    book.quantite = book.quantite + 1;
  }

  private resetNewBook(): void {
    this.newBook = {
      titre: '',
      auteur: '',
      resume: '',
      categorie: [],
      note: 0,
      quantite: 1,
      date_ajout: new Date(),
      isbn: '',
    };
    this.newBookGenresRaw = '';
  }

  // ─────────────────────────────────────────
  //  UTILISATEURS (admin only)
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
        u.prenom.toLowerCase().includes(q) ||
        u.nom.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }

  private loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.userError = 'Impossible de charger les utilisateurs.'),
    });
  }

  onRoleChange(user: User, event: Event): void {
    const newRole = Number((event.target as HTMLSelectElement).value) as UserRole;
    this.authService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        this.loadUsers();
        this.userSuccess = `Rôle de ${user.prenom} mis à jour.`;
        setTimeout(() => (this.userSuccess = ''), 3000);
      },
      error: (err: Error) => {
        this.userError = err.message ?? 'Erreur lors de la modification du rôle.';
        setTimeout(() => (this.userError = ''), 4000);
      },
    });
  }

  onDeleteUser(user: User): void {
    this.authService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        this.userSuccess = `Compte de ${user.prenom} ${user.nom} supprimé.`;
        setTimeout(() => (this.userSuccess = ''), 3000);
      },
      error: (err: Error) => {
        this.userError = err.message ?? 'Erreur lors de la suppression.';
        setTimeout(() => (this.userError = ''), 4000);
      },
    });
  }

  getRoleBadgeClass(role: UserRole): string {
    return `role-badge role-${role}`;
  }
}

