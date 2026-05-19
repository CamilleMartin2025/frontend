import { Injectable } from '@angular/core';
import { Review } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { BookService } from './book.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiReviewUrl = 'http://localhost:8080/api/review';

  constructor(
    private http: HttpClient,
    private bookService: BookService,
  ) {}

  // GET Lister tous les avis
  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiReviewUrl);
  }

  // GET Voir les avis d'un livre
  getReviews(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiReviewUrl + '/book/' + bookId);
  }

  //
  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.getAll().pipe(
      map((reviews) => {
        console.log(reviews);
        return reviews.filter((review) => Number(review.utilisateurId) === userId);
      }),
    );
  }

  // @ts-ignore
  getBookByReviewId(reviewId: number): Observable<Book> {
    return this.getAll().pipe(
      map((reviews) => reviews.find((review) => review.id === reviewId)),
      switchMap((review) => {
        if (!review) {
          throw new Error('Review not found');
        }

        return this.bookService.getById(review.livreId);
      }),
    );
  }

  // POST Laisser un avis
  createReview(data: Omit<Review, 'id'>): void {
    this.http.post<Review[]>(this.apiReviewUrl, data);
  }

  // PUT modifier mon avis
  modifyReview(data: Omit<Review, 'id'>,id : number): void {
    this.http.put<Review[]>(this.apiReviewUrl +'/'+ id, data);
  }

  // DELETE supprimer un avis
  deleteReview(id: number): void {
    this.http.delete<Review[]>(this.apiReviewUrl + '/'+ id);
  }

  setBookNote(bookId: number): void {
    this.getReviews(bookId)
      .pipe(
        map((reviews) => {
          const notes = reviews.map((r) => r.note).filter((n) => n != null);

          return notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : 0;
        }),
        switchMap((moyenne) =>
          this.bookService.updateBook(bookId, {
            note: moyenne,
          }),
        ),
      )
      .subscribe((updatedBook) => {
        console.log('Book mis à jour:', updatedBook);
      });
  }
}
