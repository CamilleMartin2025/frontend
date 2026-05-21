import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  /**
   * Centralisation de la récupération des Headers avec le Token JWT
   */
  private getHeaders(): HttpHeaders {
    // On va chercher le token avec le VRAI nom utilisé par Camille
    const token = localStorage.getItem('bookhub_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ── Récupération brute ────────────────────────────

  // GET Voir l'activité globale des emprunts
  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiLoanUrl, { headers: this.getHeaders() });
  }

  // GET Récupérer mon historique
  getByUserId(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiLoanUrl}/my`, { headers: this.getHeaders() });
  }

  // GET Voir les emprunts en retard
  getLate(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiLoanUrl}/late`, { headers: this.getHeaders() });
  }

  // ── Enrichissement ────────────────────────────────

  /**
   * Enrichit un Loan en LoanView de façon asynchrone
   */
  /**
   * Enrichit un Loan en LoanView de façon asynchrone
   */
  enrich(loan: Loan): Observable<LoanView> {
    const today = new Date();
    const dueDate = new Date(loan.dateRetourPrevu);
    const diffMs = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // @ts-ignore
    return this.bookService.getById(loan.livreId).pipe(
      map((book: Book | undefined) => ({
        id: loan.id,
        id_livre: loan.livreId, // <-- Modifié pour correspondre à LoanView
        id_utilisateur: loan.utilisateurId, // <-- Modifié pour correspondre à LoanView
        date_emprunt: new Date(loan.dateEmprunt),
        date_retour_prevu: dueDate,
        date_retour_effectif: loan.dateRetourEffectif ? new Date(loan.dateRetourEffectif) : null,
        daysLeft,
        isLate: daysLeft < 0 && !loan.dateRetourEffectif,
        book,
      })),
    );
  }

  /**
   * Enrichit une liste de Loans en parallèle
   */
  enrichAll(loans: Loan[]): Observable<LoanView[]> {
    if (loans.length === 0) return of([]);
    return forkJoin(loans.map((l) => this.enrich(l)));
  }

  // ── Méthodes prêtes pour les templates ────────────

  /** Emprunts enrichis d'un utilisateur */
  getViewsByUserId(): Observable<LoanView[]> {
    return this.getByUserId().pipe(switchMap((loans) => this.enrichAll(loans)));
  }

  /** Tous les emprunts enrichis (admin/libraire) */
  getAllViews(): Observable<LoanView[]> {
    return this.getAll().pipe(switchMap((loans) => this.enrichAll(loans)));
  }

  // ── Actions ───────────────────────────────────────

  // POST Effectuer un nouvel emprunt
  borrow(id_livre: number): Observable<Loan> {
    return this.http.post<Loan>(
      `${this.apiLoanUrl}/loan?livreId=${id_livre}`,
      {},
      { headers: this.getHeaders() },
    );
  }

  // PATCH Valider le retour d'un livre
  return(loanId: number): Observable<Loan> {
    return this.http.patch<Loan>(
      `${this.apiLoanUrl}/return/${loanId}`,
      {},
      { headers: this.getHeaders() },
    );
  }
}
