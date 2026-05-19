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

  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiReviewUrl);
  }

  getReviews(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiReviewUrl + '/book/' + bookId);
  }

  getReviewsByUser(userId : number) : Observable<Review[]>{
    return this.getAll().pipe(
      map((reviews) => {
        return reviews.filter((review) => review.utilisateurId === userId);
      }),
    );
  }

  createReview(data: Omit<Review, 'id'>): void {
    this.http.post<Review[]>(this.apiReviewUrl, data);
  }

  setBookNote(bookId: number): void {
    this.getReviews(bookId)
      .pipe(
        map((reviews) => {
          const notes = reviews
            .map((r) => r.note)
            .filter((n) => n != null);

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
