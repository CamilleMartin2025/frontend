import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card.component';
import { Book, Review } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit {
  bookId!: number;
  borrowed = false;

  // Données fictives — à remplacer par un appel au BookService
  book: Book = {
    id: 7,
    title: 'La Prof',
    author: 'Freida McFadden',
    cover: 'https://m.media-amazon.com/images/I/81hqUOLSqEL.jpg',
    description: `Chaque matin, Eve et son mari, Nate, partent ensemble au lycée où elle enseigne les mathématiques et lui l'anglais. Une vie parfaite, réglée comme du papier à musique.

Pourtant, l'établissement a récemment été secoué par un scandale. Un professeur a été licencié parce qu'il aurait eu une liaison avec l'une de ses élèves, Addie. Et cette année, elle se retrouve dans la classe d'Eve et dans celle de son charmant mari.

Comme tout le monde, Eve sait que l'on ne peut pas faire confiance à la jeune fille. Mais quand la prof commence à comprendre qui est véritablement Addie, il est peut-être déjà trop tard...`,
    genre: ['Policier', 'Thriller'],
    rating: 4,
    available: true,
  };

  reviews: Review[] = [
    {
      id: 1,
      title: 'Impossible à poser !',
      body: "Un thriller haletant du début à la fin. Les rebondissements s'enchaînent et on ne voit pas venir la fin. Freida McFadden maîtrise parfaitement l'art du suspense.",
      reviewerName: 'Sophie M.',
      date: new Date('2026-03-15'),
      rating: 5,
    },
    {
      id: 2,
      title: 'Très bien mais prévisible',
      body: "L'écriture est fluide et l'ambiance bien installée, mais j'ai deviné la fin assez tôt. Reste une lecture agréable et bien rythmée.",
      reviewerName: 'Thomas R.',
      date: new Date('2026-02-28'),
      rating: 3,
    },
    {
      id: 3,
      title: 'Un coup de cœur !',
      body: "Je l'ai dévoré en une nuit. Le personnage d'Addie est fascinant, on ne sait jamais ce qu'elle pense vraiment. À lire absolument.",
      reviewerName: 'Camille L.',
      date: new Date('2026-02-10'),
      rating: 5,
    },
  ];

  alsoRead: Book[] = [
    {
      id: 10,
      title: 'La locataire',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description: 'Un thriller psychologique sur une colocataire qui cache de sombres secrets.',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 11,
      title: 'Le boyfriend',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description: "Sydney cherche l'amour, mais ses rencontres tournent toujours au drame.",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: false,
    },
    {
      id: 12,
      title: 'La psy',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description: "Une psychiatre découvre que l'un de ses patients cache un terrible secret.",
      genre: ['Policier', 'Thriller'],
      rating: 5,
      available: true,
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    // TODO: this.bookService.getById(this.bookId).subscribe(...)
  }

  onBorrow() {
    if (this.book.available) {
      this.borrowed = true;
      this.book.available = false;
      // TODO: appel au LoanService
    }
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
