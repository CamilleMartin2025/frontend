import { Injectable } from '@angular/core';
import { Book } from '../models/model';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Ajout de HttpHeaders ici
import { Observable, of } from 'rxjs';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiBookUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  /**
   * Centralisation de la récupération du token JWT de Camille
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('bookhub_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // GET Lister tous les livres
  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiBookUrl);
  }

  // GET Détails d'un livre
  getById(id: number): Observable<Book | undefined> {
    return this.http.get<Book>(this.apiBookUrl + '/' + id);
  }

  // Livres du même auteur (hors livre courant)
  getByAuthor(author: string, excludeId: number): Observable<Book[]> {
    return this.getAll().pipe(
      map((books) => books.filter((b) => b.auteur === author && b.id !== excludeId)),
    );
  }

  // Livres du même genre (hors livre courant)
  getSimilar(book: Book): Observable<Book[]> {
    return this.getAll().pipe(
      map((books) => {
        console.log(books);
        return books.filter((b) => b.id !== book.id && b.categorie == book.categorie).slice(0, 3);
      }),
    );
  }

  // 3 Livres les plus récemments ajoutés au catalogue
  getNew(): Observable<Book[]> {
    return this.getAll().pipe(
      map((books) =>
        [...books]
          .sort((a, b) => new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime())
          .slice(0, 3),
      ),
    );
  }

  // 3 Livres les mieux notés
  getBestRating(): Observable<Book[]> {
    return this.getAll().pipe(
      map((books) =>
        [...books]
          .filter((b) => b.note != null)
          .sort((a, b) => b.note - a.note)
          .slice(0, 3),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  //  CRUD CATALOGUE (libraire & admin)
  // ─────────────────────────────────────────────────

  // POST Ajouter un nouveau livre
  addBook(data: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiBookUrl, data, { headers: this.getHeaders() });
  }

  // DELETE Supprimer un livre
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBookUrl}/${id}`, { headers: this.getHeaders() });
  }

  // PUT Modifier un livre
  updateBook(id: number, changes: Partial<Omit<Book, 'id'>>): Observable<Book> {
    return this.http.put<Book>(`${this.apiBookUrl}/${id}`, changes, { headers: this.getHeaders() });
  }

  // GET Rechercher des livres
  searchBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiBookUrl + '/search');
  }
}
