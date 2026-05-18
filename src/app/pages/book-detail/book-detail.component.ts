import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book, Review } from '../../models/model';
import { ReviewService } from '../../services/review.service';
import { BookService } from '../../services/book.service';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailComponent implements OnInit {
  // On transforme l'objet en Observable
  book$!: Observable<Book | undefined>;
  reviews$!: Observable<Review[]>;
  similar$!: Observable<Book[]>;
  sameAuthor$!: Observable<Book[]>;

  reviews: Review[] = [];
  similar: Book[] = [];
  sameAuthor: Book[] = [];
  borrowed = false;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private bookService: BookService
  ) {}

ngOnInit(): void {
    //  on récupère le livre
    this.book$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const idParam = params.get('id');
        if (!idParam) return of(undefined);

        const id = Number(idParam);
        if (isNaN(id)) {
          this.notFound = true;
          return of(undefined);
        }

        return this.bookService.getById(id).pipe(
          tap((book) => {
            this.notFound = !book;
          }),
          catchError((err) => {
            console.error('book error', err);
            this.notFound = true;
            return of(undefined);
          })
        );
      }),
      shareReplay(1) // Évite de re-déclencher la requête HTTP du livre pour chaque composant secondaire
    );

    // On lie dynamiquement les avis
    this.reviews$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return isNaN(id) ? of([]) : this.reviewService.getReviews(id);
      }),
      catchError((err) => {
        console.error('reviews error', err);
        return of([]);
      })
    );

    // On lie les livres similaires
    this.similar$ = this.book$.pipe(
      switchMap((book) => {
        if (!book) return of([]);
        return this.bookService.getSimilar(book);
      }),
      catchError((err) => {
        console.error('similar error', err);
        return of([]);
      })
    );

    // On lie les livres du même auteur
    this.sameAuthor$ = this.book$.pipe(
      switchMap((book) => {
        if (!book || !book.id) return of([]);
        return this.bookService.getByAuthor(book.auteur, book.id);
      }),
      catchError((err) => {
        console.error('author error', err);
        return of([]);
      })
    );
  }

  starsArray(note: number): boolean[] {
    const stars = [];
    const safeNote = Math.min(Math.max(Math.round(note || 0), 0), 5);
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= safeNote);
    }
    return stars;
  }

  onBorrow(): void {
    this.borrowed = true;
  }
}
