import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card.component';
import { Book, Event } from '../../models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  searchQuery = '';

  mostBorrowed: Book[] = [
    {
      id: 1,
      title: 'Don Quichotte',
      author: 'Cervantes',
      cover: 'https://m.media-amazon.com/images/I/81JdvvNqhfL.jpg',
      description:
        'Les aventures du célèbre chevalier à la triste figure et de son fidèle écuyer Sancho Panza.',
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: true,
    },
    {
      id: 2,
      title: 'Alice au pays des merveilles',
      author: 'Lewis Carroll',
      cover: 'https://m.media-amazon.com/images/I/81gSEGpEHkL.jpg',
      description:
        'Alice suit un lapin blanc et tombe dans un monde fantastique peuplé de créatures étranges.',
      genre: ['Classique', 'Fantaisie'],
      rating: 5,
      available: true,
    },
    {
      id: 3,
      title: "Les aventures d'Huckleberry Finn",
      author: 'Mark Twain',
      cover: 'https://m.media-amazon.com/images/I/71wATxyBsRL.jpg',
      description: "Huck Finn s'échappe de chez lui et descend le Mississippi avec l'esclave Jim.",
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: false,
    },
  ];

  topRated: Book[] = [
    {
      id: 4,
      title: 'Facile',
      author: 'Magnus Nabo',
      cover: 'https://m.media-amazon.com/images/I/71q7PpG0mvL.jpg',
      description:
        "Le guide pratique de la vie d'échecs — un regard décalé sur nos petits ratés du quotidien.",
      genre: ['Développement personnel', 'Humour'],
      rating: 5,
      available: true,
    },
    {
      id: 5,
      title: "L'intruse",
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description: "Un thriller psychologique haletant où rien n'est ce qu'il semble être.",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 6,
      title: "D'autres printemps",
      author: 'Virginie Grimaldi',
      cover: 'https://m.media-amazon.com/images/I/71kJFgNWeiL.jpg',
      description: 'Une histoire poignante sur le temps qui passe et les liens familiaux.',
      genre: ['Roman', 'Contemporain'],
      rating: 5,
      available: false,
    },
  ];

  newBooks: Book[] = [
    {
      id: 7,
      title: 'La Prof',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/81hqUOLSqEL.jpg',
      description:
        'Chaque matin, Eve et son mari partent ensemble au lycée. Mais quand elle commence à comprendre qui est vraiment Addie, il est peut-être déjà trop tard.',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 8,
      title: "L'Autre moi",
      author: 'Franck Thilliez',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description:
        'Un thriller psychologique qui brouille les frontières entre identité et illusion.',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 9,
      title: "L'élégance de la manipulation",
      author: 'Marwan Mery',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description:
        'Comment influencer et convaincre sans conflit — les techniques de la manipulation élégante.',
      genre: ['Développement personnel'],
      rating: 3,
      available: false,
    },
  ];

  upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Nuit de la lecture',
      description:
        'Une nuit magique dédiée à la lecture, avec ateliers, films et discussions autour des livres.',
      image: 'assets/events/nuit-lecture.jpg',
      date: new Date('2026-01-23'),
    },
    {
      id: 2,
      title: 'Salon du livre',
      description:
        'Rencontrez vos auteurs préférés et découvrez les nouvelles parutions lors de ce salon incontournable.',
      image: 'assets/events/salon-livre.jpg',
      date: new Date('2026-03-01'),
    },
  ];

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Recherche :', this.searchQuery);
      // À connecter au service de recherche
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.onSearch();
  }
}
