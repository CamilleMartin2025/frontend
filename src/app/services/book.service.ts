import { Injectable } from '@angular/core';
import { Book } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiBookUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiBookUrl);
  }

  getById(id: number): Observable<Book | undefined> {
    return this.getAll().pipe(map((books) => books.find((b) => b.id === id)));
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
      map((books) =>
        books
          .filter((b) => b.id !== book.id && b.categorie.some((g) => book.categorie.includes(g)))
          .slice(0, 3),
      ),
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

  /** Ajoute un livre et retourne le livre créé */
  addBook(data: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiBookUrl, data);
  }

  /** Supprime un livre par id, retourne true si trouvé */
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBookUrl}/${id}`);
  }

  /** Met à jour un livre existant */
  updateBook(id: number, changes: Partial<Omit<Book, 'id'>>): Observable<Book> {
    return this.http.patch<Book>(`${this.apiBookUrl}/${id}`, changes);
  }

  /** Liste tous les genres distincts présents dans le catalogue */
  getAllGenres(): Observable<string[]> {
    return this.getAll().pipe(map((books) => [...new Set(books.flatMap((b) => b.categorie))].sort()));
  }
}

