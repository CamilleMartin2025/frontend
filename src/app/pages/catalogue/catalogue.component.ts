import { Component, OnInit, computed, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/model';
import { BookService } from '../../services/book.service';
import { isEmpty } from 'rxjs';

type SortOption = 'title-asc' | 'title-desc' | 'author-asc' | 'rating-desc';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
})
export class CatalogueComponent implements OnInit {
  // Tous les filtres en signals
  searchQuery = signal('');
  selectedGenre = signal<string>('');
  availabilityFilter = signal<'all' | 'available' | 'unavailable'>('all');
  sortBy = signal<SortOption>('title-asc');
  filtersOpen = signal(false);

  // Source de données en signal pour que computed() réagisse correctement
  private allBooksSignal = signal<Book[]>([]);
  allGenres: string[] = [];

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookService.getAll().subscribe((books) => {
      this.allBooksSignal.set(books);

      this.allGenres = [...new Set(books.flatMap((b) => b.categorie))].sort();

      this.cdr.detectChanges();
    });
  }

  // computed() dépend uniquement de signals → recalcul garanti et synchrone
  filteredBooks = computed(() => {
    const books = this.allBooksSignal(); // ← signal, réactif
    const q = this.searchQuery().toLowerCase().trim();
    const genre = this.selectedGenre();
    const avail = this.availabilityFilter();
    const sort = this.sortBy();

    const result = books.filter((book) => {
      const matchSearch =
        !q ||
        book.titre.toLowerCase().includes(q) ||
        book.auteur.toLowerCase().includes(q) ||
        book.categorie.toLowerCase().includes(q);

      const matchGenre = book.categorie == genre || book.categorie != genre;

      const matchAvail =
        avail === 'all' ||
        (avail === 'available' && book.quantite > 0) ||
        (avail === 'unavailable' && book.quantite == 0);

      return matchSearch && matchGenre && matchAvail;
    });


    return [...result].sort((a, b) => {
      switch (sort) {
        case 'title-asc':
          return a.titre.localeCompare(b.titre, 'fr');
        case 'title-desc':
          return b.titre.localeCompare(a.titre, 'fr');
        case 'author-asc':
          return a.auteur.localeCompare(b.auteur, 'fr');
        case 'rating-desc':
          return b.note - a.note;
        default:
          return 0;
      }
    });
  });

  resultCount = computed(() => this.filteredBooks().length);
  hasActiveFilters = computed(
    () => this.selectedGenre() !== '' || this.availabilityFilter() !== 'all',
  );

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  toggleGenre(genre: string) {
    const current = this.selectedGenre();
    this.selectedGenre.set(genre);
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenre().includes(genre);
  }

  setAvailability(v: 'all' | 'available' | 'unavailable') {
    this.availabilityFilter.set(v);
  }
  setSort(v: string) {
    this.sortBy.set(v as SortOption);
  }
  toggleFilters() {
    this.filtersOpen.set(!this.filtersOpen());
  }

  clearFilters() {
    this.selectedGenre.set('');
    this.availabilityFilter.set('all');
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
