import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

type SortOption = 'title-asc' | 'title-desc' | 'author-asc' | 'rating-desc';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
})
export class CatalogueComponent implements OnInit {
  searchQuery = signal('');
  selectedGenres = signal<string[]>([]);
  availabilityFilter = signal<'all' | 'available' | 'unavailable'>('all');
  sortBy = signal<SortOption>('title-asc');
  filtersOpen = signal(false);

  allBooks: Book[] = [];
  allGenres: string[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.allBooks = this.bookService.getAll();
    this.allGenres = [...new Set(this.allBooks.flatMap((b) => b.genre))].sort();
  }

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

    return [...result].sort((a, b) => {
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
  });

  resultCount = computed(() => this.filteredBooks().length);
  hasActiveFilters = computed(
    () => this.selectedGenres().length > 0 || this.availabilityFilter() !== 'all',
  );

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  toggleGenre(genre: string) {
    const current = this.selectedGenres();
    this.selectedGenres.set(
      current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre],
    );
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres().includes(genre);
  }

  setAvailability(value: 'all' | 'available' | 'unavailable') {
    this.availabilityFilter.set(value);
  }
  setSort(value: string) {
    this.sortBy.set(value as SortOption);
  }
  toggleFilters() {
    this.filtersOpen.set(!this.filtersOpen());
  }

  clearFilters() {
    this.selectedGenres.set([]);
    this.availabilityFilter.set('all');
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
