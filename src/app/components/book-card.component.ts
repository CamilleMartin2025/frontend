import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../models/model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="book-card">
      <a [routerLink]="['/book', book.id]" class="cover-link">
        <div class="book-cover">
<!--          <img [src]="book.cover" [alt]="book.title" loading="lazy" />-->
          <div class="cover-overlay">
            <span>Voir le livre</span>
          </div>
        </div>
      </a>
      <div class="book-info">
        <h3 class="book-title">{{ book.titre }}</h3>
        <p class="book-author">{{ book.auteur }}</p>
        <p class="book-desc">{{ book.resume }}</p>
        <a [routerLink]="['/book', book.id]" class="btn-primary discover-btn">Découvrir</a>
      </div>
    </div>
  `,
  styles: [
    `
      .book-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        animation: fadeUp 0.4s ease forwards;
      }

      .cover-link {
        display: block;
      }

      .book-cover {
        position: relative;
        border-radius: var(--radius-md);
        overflow: hidden;
        aspect-ratio: 2/3;
        background: var(--color-tag-bg);
      }

      .book-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .cover-overlay {
        position: absolute;
        inset: 0;
        background: rgba(26, 26, 26, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        color: #fff;
        font-weight: 600;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
      }

      .book-card:hover .cover-overlay {
        opacity: 1;
      }
      .book-card:hover img {
        transform: scale(1.04);
      }

      .book-title {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .book-author {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        margin-top: 2px;
      }

      .book-desc {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin-top: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .discover-btn {
        margin-top: 8px;
        width: 100%;
        text-align: center;
        padding: 10px 0;
      }
    `,
  ],
})
export class BookCardComponent {
  @Input() book!: Book;
}
