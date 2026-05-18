import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
      const id = Number(params.get('id'));
      this.loadBook(id);
    });
  }

  private loadBook(id: number): void {
    this.bookService.getById(id).subscribe((book: Book | undefined) => {
      if (!book) {
        this.notFound = true;
        return;
      }

      const currentBook: Book = book;
      this.book = currentBook;
    });

      this.notFound = false;

      this.reviewService.getReviews(id).subscribe((reviews) => {
        this.reviews = reviews;
      });

      this.bookService.getSimilar(this.book).subscribe((similar) => {
        this.similar = similar;
      });

      this.bookService.getByAuthor(this.book.auteur, id).subscribe((sameAuthor) => {
        this.sameAuthor = sameAuthor;
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
