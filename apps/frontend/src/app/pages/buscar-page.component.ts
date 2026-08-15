import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import type { CityDto, NeedTag } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { CITY_CHIPS, HELP_CATEGORIES } from '../help-categories';

@Component({
  selector: 'aee-buscar-page',
  standalone: true,
  imports: [FormsModule, NgFor, RouterLink],
  template: `
    <section class="page">
      <div class="wrap">
        <p class="kicker">Encontrar ayuda · Colombia</p>
        <h1>¿Qué necesitas?</h1>
        <p class="lead">
          Elige una categoría y una ciudad. Te mostramos
          <strong>lugares y organizaciones</strong> donde puedes llevar apoyo o pedir orientación —
          sin que nosotros manejemos donaciones.
        </p>

        <label class="search">
          <span class="sr">Buscar</span>
          <input
            [(ngModel)]="query"
            placeholder="Busca: agua, acopio, albergue…"
            (keyup.enter)="go()"
          />
        </label>

        <h2>Categorías</h2>
        <div class="grid" role="list">
          <button
            type="button"
            class="cat"
            *ngFor="let c of cats"
            [class.on]="tag === c.id"
            (click)="tag = c.id"
          >
            <strong>{{ c.title }}</strong>
            <small>{{ c.hint }}</small>
          </button>
        </div>

        <h2>¿Dónde lo necesitas?</h2>
        <div class="chips" role="group" aria-label="Ciudad">
          <button
            type="button"
            class="chip"
            *ngFor="let c of cityChips"
            [class.on]="cityCode === c.code"
            (click)="cityCode = c.code"
          >
            {{ c.label }}
          </button>
        </div>

        <label class="more">
          Otra ciudad
          <select [(ngModel)]="cityCode">
            <option value="">Todo el país</option>
            <option *ngFor="let c of cities()" [value]="c.code">
              {{ c.name }} — {{ c.department }}
            </option>
          </select>
        </label>

        <button type="button" class="cta" (click)="go()">Ver lugares que ayudan</button>
        <p class="alt">
          ¿Tu org necesita apoyo?
          <a routerLink="/publicar-punto">Publicar un lugar</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        background: var(--cream);
        padding: 2rem 0 3.5rem;
        min-height: 70vh;
      }
      .wrap {
        width: min(720px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.75rem;
        color: var(--teal);
      }
      h1 {
        margin: 0.4rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 6vw, 2.8rem);
        letter-spacing: -0.03em;
      }
      .lead {
        margin: 0.7rem 0 1.4rem;
        color: var(--muted);
        font-weight: 600;
        line-height: 1.45;
      }
      h2 {
        margin: 1.4rem 0 0.7rem;
        font-family: var(--font-display);
        font-size: 1.15rem;
      }
      .search input,
      .more select {
        width: 100%;
        min-height: 52px;
        border-radius: 16px;
        border: 1px solid var(--line);
        padding: 0.75rem 1rem;
        font: inherit;
        font-weight: 600;
        background: #fff;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.55rem;
      }
      @media (min-width: 640px) {
        .grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .cat {
        text-align: left;
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 16px;
        padding: 0.9rem 0.85rem;
        cursor: pointer;
        display: grid;
        gap: 0.25rem;
        min-height: 96px;
      }
      .cat.on {
        border-color: var(--teal);
        background: #e7f6f3;
        box-shadow: inset 0 0 0 1px var(--teal);
      }
      .cat strong {
        font-family: var(--font-display);
        font-size: 1rem;
      }
      .cat small {
        color: var(--muted);
        font-weight: 600;
        font-size: 0.8rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 999px;
        padding: 0.5rem 0.85rem;
        font-weight: 800;
        cursor: pointer;
        font-size: 0.85rem;
      }
      .chip.on {
        background: var(--ink);
        color: #fff;
        border-color: transparent;
      }
      .more {
        display: grid;
        gap: 0.35rem;
        margin-top: 0.9rem;
        font-weight: 800;
        font-size: 0.82rem;
      }
      .cta {
        margin-top: 1.5rem;
        width: 100%;
        min-height: 54px;
        border: 0;
        border-radius: 999px;
        background: var(--coral);
        color: #fff;
        font-weight: 800;
        font-size: 1.05rem;
        cursor: pointer;
      }
      .alt {
        margin: 1rem 0 0;
        text-align: center;
        font-weight: 600;
        color: var(--muted);
      }
      .alt a {
        color: var(--teal);
        font-weight: 800;
      }
      .sr {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      }
    `,
  ],
})
export class BuscarPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly cats = HELP_CATEGORIES;
  readonly cityChips = CITY_CHIPS;
  readonly cities = signal<CityDto[]>([]);
  tag: NeedTag | '' = '';
  cityCode = '';
  query = '';

  ngOnInit(): void {
    this.api.cities().subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => undefined,
    });
  }

  go(): void {
    void this.router.navigate(['/ayudar'], {
      queryParams: {
        tag: this.tag || null,
        city: this.cityCode || null,
        q: this.query.trim() || null,
      },
    });
  }
}
