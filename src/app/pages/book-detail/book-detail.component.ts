import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card.component';
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
  book: Book | undefined;
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
    this.bookService.getById(id).subscribe((book) => {
      if (!book) {
        this.notFound = true;
        return;
      }

      this.book = book;
      this.notFound = false;

      this.reviewService.getReviews(id).subscribe((reviews) => {
        this.reviews = reviews;
      });

      this.bookService.getSimilar(book).subscribe((similar) => {
        this.similar = similar;
      });

      this.bookService.getByAuthor(book.auteur, id).subscribe((sameAuthor) => {
        this.sameAuthor = sameAuthor;
      });
    });
  }

  onBorrow(): void {
    if (this.book?.quantite != 0) {
      this.borrowed = true;
      this.book.quantite - 1;
      // TODO: LoanService.borrow(this.book.id)
    }
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
