import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card.component';
import { Book } from '../../models/model';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  // Livres les mieux notés
  topRated!: Observable<Book[]>;

  // Livres les plus récents
  newBooks!: Observable<Book[]>;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.topRated = this.bookService.getBestRating();
    this.newBooks = this.bookService.getNew();
  }

}
