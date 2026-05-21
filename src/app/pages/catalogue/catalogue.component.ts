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
  selectedCategories = signal<string[]>([]);
  availabilityFilter = signal<'all' | 'available' | 'unavailable'>('all');
  sortBy = signal<SortOption>('title-asc');
  filtersOpen = signal(false);

  // Source de données en signal pour que computed() réagisse correctement
  private allBooksSignal = signal<Book[]>([]);
  allGenres: string[] = [];

  // Pagination
  pageActuelle = signal<number>(1);
  livresParPage = 20;
  // Calcul du nombre total de pages
  totalPages = computed(() => Math.ceil(this.allBooksSignal().length / this.livresParPage));
  // Les livres à afficher pour la page active (Découpage de l'index)
  livresAffiches = computed(() => {
    const indexDebut = (this.pageActuelle() - 1) * this.livresParPage;
    const indexFin = indexDebut + this.livresParPage;
    return this.allBooksSignal().slice(indexDebut, indexFin);
  });
  // Méthode pour changer de page
  changerPage(nouvellePage: number): void {
    if (nouvellePage >= 1 && nouvellePage <= this.totalPages()) {
      this.pageActuelle.set(nouvellePage);
    }
  }

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
    const books = this.livresAffiches(); // ← signal, réactif
    const q = this.searchQuery().toLowerCase().trim();
    const categories = this.selectedCategories();
    const avail = this.availabilityFilter();
    const sort = this.sortBy();

    const result = books.filter((book) => {
      const matchSearch =
        !q ||
        book.titre.toLowerCase().includes(q) ||
        book.auteur.toLowerCase().includes(q) ||
        book.categorie.toLowerCase().includes(q);

      const matchGenre = categories.length === 0 || categories.includes(book.categorie);

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
    () => this.selectedCategories().length > 0 || this.availabilityFilter() !== 'all',
  );

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  toggleCategory(cat: string): void {
    const current = this.selectedCategories();
    this.selectedCategories.set(
      current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat],
    );
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories().includes(cat);
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
    this.selectedCategories.set([]);
    this.availabilityFilter.set('all');
  }

  starsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
