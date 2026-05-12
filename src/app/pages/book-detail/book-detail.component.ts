import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card.component';
import { BookService } from '../../services/book.service';
import { Book, Review } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
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
    private router: Router,
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
    this.borrowed = false;
    this.book = this.bookService.getById(id);

    if (!this.book) {
      this.notFound = true;
      return;
    }

    this.notFound = false;
    this.reviews = this.bookService.getReviews(id);
    this.similar = this.bookService.getSimilar(this.book);
    this.sameAuthor = this.bookService.getByAuthor(this.book.author, id);
  }

  onBorrow(): void {
    if (this.book?.available) {
      this.borrowed = true;
      this.book.available = false;
      // TODO: LoanService.borrow(this.book.id)
    }
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
