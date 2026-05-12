import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

type SortOption = 'title-asc' | 'title-desc' | 'author-asc' | 'rating-desc';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
})
export class CatalogueComponent {
  // ── État des filtres ──
  searchQuery = signal('');
  selectedGenres = signal<string[]>([]);
  availabilityFilter = signal<'all' | 'available' | 'unavailable'>('all');
  sortBy = signal<SortOption>('title-asc');
  filtersOpen = signal(false);

  // ── Catalogue complet (données fictives — remplacer par BookService) ──
  allBooks: Book[] = [
    {
      id: 1,
      title: 'Don Quichotte',
      author: 'Cervantes',
      cover: 'https://m.media-amazon.com/images/I/81JdvvNqhfL.jpg',
      description: '',
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: true,
    },
    {
      id: 2,
      title: 'Alice au pays des merveilles',
      author: 'Lewis Carroll',
      cover: 'https://m.media-amazon.com/images/I/81gSEGpEHkL.jpg',
      description: '',
      genre: ['Classique', 'Fantaisie'],
      rating: 5,
      available: true,
    },
    {
      id: 3,
      title: "Les aventures d'Huckleberry Finn",
      author: 'Mark Twain',
      cover: 'https://m.media-amazon.com/images/I/71wATxyBsRL.jpg',
      description: '',
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: false,
    },
    {
      id: 4,
      title: 'Facile',
      author: 'Magnus Nabo',
      cover: 'https://m.media-amazon.com/images/I/71q7PpG0mvL.jpg',
      description: '',
      genre: ['Développement personnel', 'Humour'],
      rating: 5,
      available: true,
    },
    {
      id: 5,
      title: "L'intruse",
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 6,
      title: "D'autres printemps",
      author: 'Virginie Grimaldi',
      cover: 'https://m.media-amazon.com/images/I/71kJFgNWeiL.jpg',
      description: '',
      genre: ['Roman', 'Contemporain'],
      rating: 5,
      available: false,
    },
    {
      id: 7,
      title: 'La Prof',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/81hqUOLSqEL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 8,
      title: "L'Autre moi",
      author: 'Franck Thilliez',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 9,
      title: "L'élégance de la manipulation",
      author: 'Marwan Mery',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description: '',
      genre: ['Développement personnel'],
      rating: 3,
      available: false,
    },
    {
      id: 10,
      title: 'La locataire',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 11,
      title: 'Le boyfriend',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: false,
    },
    {
      id: 12,
      title: 'La psy',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description: '',
      genre: ['Policier', 'Thriller'],
      rating: 5,
      available: true,
    },
    {
      id: 13,
      title: "L'Étranger",
      author: 'Albert Camus',
      cover: 'https://m.media-amazon.com/images/I/41pFLMkOqhL.jpg',
      description: '',
      genre: ['Classique', 'Philosophie'],
      rating: 5,
      available: false,
    },
    {
      id: 14,
      title: 'Dune',
      author: 'Frank Herbert',
      cover: 'https://m.media-amazon.com/images/I/81ym3QUd3KL.jpg',
      description: '',
      genre: ['Science-fiction', 'Aventure'],
      rating: 5,
      available: false,
    },
    {
      id: 15,
      title: '1984',
      author: 'George Orwell',
      cover: 'https://m.media-amazon.com/images/I/71kxa2iBsNL.jpg',
      description: '',
      genre: ['Classique', 'Dystopie'],
      rating: 5,
      available: true,
    },
    {
      id: 16,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      cover: 'https://m.media-amazon.com/images/I/81q6G5ZQWEL.jpg',
      description: '',
      genre: ['Classique', 'Philosophie'],
      rating: 5,
      available: true,
    },
    {
      id: 17,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      cover: 'https://m.media-amazon.com/images/I/71Z7kpw7yJL.jpg',
      description: '',
      genre: ['Histoire', 'Essai'],
      rating: 4,
      available: true,
    },
    {
      id: 18,
      title: 'Le nom de la rose',
      author: 'Umberto Eco',
      cover: 'https://m.media-amazon.com/images/I/81r3wlFcRmL.jpg',
      description: '',
      genre: ['Policier', 'Histoire'],
      rating: 4,
      available: false,
    },
  ];

  // ── Tous les genres disponibles ──
  allGenres = [...new Set(this.allBooks.flatMap((b) => b.genre))].sort();

  // ── Livres filtrés (signal computed) ──
  filteredBooks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const genres = this.selectedGenres();
    const avail = this.availabilityFilter();
    const sort = this.sortBy();

    let result = this.allBooks.filter((book) => {
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.some((g) => g.toLowerCase().includes(q));

      const matchGenre = genres.length === 0 || book.genre.some((g) => genres.includes(g));

      const matchAvail =
        avail === 'all' ||
        (avail === 'available' && book.available) ||
        (avail === 'unavailable' && !book.available);

      return matchSearch && matchGenre && matchAvail;
    });

    // Tri
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'title-asc':
          return a.title.localeCompare(b.title, 'fr');
        case 'title-desc':
          return b.title.localeCompare(a.title, 'fr');
        case 'author-asc':
          return a.author.localeCompare(b.author, 'fr');
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return result;
  });

  resultCount = computed(() => this.filteredBooks().length);
  hasActiveFilters = computed(
    () => this.selectedGenres().length > 0 || this.availabilityFilter() !== 'all',
  );

  // ── Actions ──
  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  toggleGenre(genre: string) {
    const current = this.selectedGenres();
    if (current.includes(genre)) {
      this.selectedGenres.set(current.filter((g) => g !== genre));
    } else {
      this.selectedGenres.set([...current, genre]);
    }
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres().includes(genre);
  }

  setAvailability(value: 'all' | 'available' | 'unavailable') {
    this.availabilityFilter.set(value);
  }

  setSort(value: SortOption) {
    this.sortBy.set(value as SortOption);
  }

  clearFilters() {
    this.selectedGenres.set([]);
    this.availabilityFilter.set('all');
  }

  toggleFilters() {
    this.filtersOpen.set(!this.filtersOpen());
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
