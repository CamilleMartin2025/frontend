import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { Loan, LoanView } from '../models/model';
import { BookService } from './book.service';
import { Book } from '../models/model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private apiLoanUrl = 'http://localhost:8080/api/loans';

  constructor(
    private http: HttpClient,
    private bookService: BookService,
  ) {}

  // ── Récupération brute ────────────────────────────

  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiLoanUrl);
  }

  getByUserId(userId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiLoanUrl}?userId=${userId}`);
    // Alternative si pas de filtre API :
    // return this.getAll().pipe(
    //   map(loans => loans.filter(l => l.id_utilisateur === userId))
    // );
  }

  // ── Enrichissement ────────────────────────────────

  /**
   * Enrichit un Loan en LoanView de façon asynchrone :
   * - parse les dates ISO
   * - calcule daysLeft et isLate
   * - récupère le Book via Observable (peut être undefined)
   */
  enrich(loan: Loan): Observable<LoanView> {
    const today = new Date();
    const dueDate = new Date(loan.date_retour_prevu);
    const diffMs = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // getById renvoie Observable<Book | undefined> → on l'attend avant de construire LoanView
    // @ts-ignore
    return this.bookService.getById(loan.id_livre).pipe(
      map((book: Book | undefined) => ({
        id: loan.id,
        id_livre: loan.id_livre,
        id_utilisateur: loan.id_utilisateur,
        date_emprunt: new Date(loan.date_emprunt),
        date_retour_prevu: dueDate,
        date_retour_effectif: loan.date_retour_effectif
          ? new Date(loan.date_retour_effectif)
          : null,
        daysLeft,
        isLate: daysLeft < 0 && !loan.date_retour_effectif,
        book, // undefined si non trouvé → géré dans le template avec ?.
      })),
    );
  }

  /**
   * Enrichit une liste de Loans en parallèle via forkJoin.
   * forkJoin attend que tous les Observables soient complétés
   * avant d'émettre le tableau final.
   * Si la liste est vide, retourne of([]) directement.
   */
  enrichAll(loans: Loan[]): Observable<LoanView[]> {
    if (loans.length === 0) return of([]);
    return forkJoin(loans.map((l) => this.enrich(l)));
  }

  // ── Méthodes prêtes pour les templates ────────────

  /** Emprunts enrichis d'un utilisateur → Observable<LoanView[]> */
  getViewsByUserId(userId: number): Observable<LoanView[]> {
    return this.getByUserId(userId).pipe(switchMap((loans) => this.enrichAll(loans)));
  }

  /** Tous les emprunts enrichis (admin/libraire) */
  getAllViews(): Observable<LoanView[]> {
    return this.getAll().pipe(switchMap((loans) => this.enrichAll(loans)));
  }

  // ── Actions ───────────────────────────────────────

  create(id_livre: number, id_utilisateur: number): Observable<Loan> {
    return this.http.post<Loan>(this.apiLoanUrl, { id_livre, id_utilisateur });
  }

  renew(loanId: number): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiLoanUrl}/${loanId}/renew`, {});
  }

  return(loanId: number): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiLoanUrl}/${loanId}/return`, {});
  }
}
