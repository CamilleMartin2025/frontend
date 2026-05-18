import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book, Review } from '../../models/model';
import { ReviewService } from '../../services/review.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  reviews: Review[] = [];
  similar: Book[] = [];
  sameAuthor: Book[] = [];
  borrowed = false;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    // Recharger quand l'id change (navigation entre livres liés)
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) return;

      const id = Number(idParam);
      if (isNaN(id)) {
        this.notFound = true;
        return;
      }

      this.loadBook(id);
    });
  }

  private loadBook(id: number): void {
    this.bookService.getById(id).subscribe({
      next: (book) => {
        if (!book) {
          this.notFound = true;
          return;
        }

        this.book = book;

        this.reviewService.getReviews(id).subscribe({
          next: (r) => (this.reviews = r),
          error: (err) => console.error('reviews error', err),
        });

        this.bookService.getSimilar(book).subscribe({
          next: (s) => (this.similar = s),
          error: (err) => console.error('similar error', err),
        });

        this.bookService.getByAuthor(book.auteur, id).subscribe({
          next: (a) => (this.sameAuthor = a),
          error: (err) => console.error('author error', err),
        });
      },
      error: (err) => {
        console.error('book error', err);
        this.notFound = true;
      },
    });
  }

  setBorrowQuantity(book: Book): void {
    if (book.quantite > 0) {
      book.quantite = book.quantite - 1;
    }
  }

  onBorrow(): void {
    if (this.book?.quantite != 0) {
      this.borrowed = true;
      this.setBorrowQuantity(this.book);
    }
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
