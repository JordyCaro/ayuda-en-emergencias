import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { CityDto, NeedTag, PlaceDto, PlaceType } from '@aee/shared-types';
import { ApiService } from '../api.service';
import {
  CITY_CHIPS,
  HELP_CATEGORIES,
  PLACE_KIND_FILTERS,
  needTagLabel,
} from '../help-categories';
import { placeTypeLabel } from '../plain-labels';

@Component({
  selector: 'aee-ayudar-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="hero">
      <div class="wrap">
        <p class="kicker">Colombia · dónde ayudar</p>
        <h1>Lugares y organizaciones que necesitan apoyo</h1>
        <p class="lead">
          Lista nacional (no solo Bogotá). Elige ciudad y qué se necesita. Nosotros
          <strong>no recibimos donaciones</strong>: si hay enlace, es el canal de ellos.
        </p>
        <p class="stamp" *ngIf="updatedHint()">Última carga: {{ updatedHint() }}</p>
        <div class="toolbar">
          <a class="cta" routerLink="/buscar">¿Qué necesitas?</a>
          <a class="ghost" routerLink="/publicar-punto">Publicar un lugar</a>
        </div>
      </div>
    </section>

    <section class="body">
      <div class="wrap">
        <div class="filters">
          <p class="label">Qué se necesita</p>
          <div class="chips">
            <button type="button" class="chip" [class.on]="!tag" (click)="setTag('')">Todos</button>
            <button
              type="button"
              class="chip"
              *ngFor="let c of cats"
              [class.on]="tag === c.id"
              (click)="setTag(c.id)"
            >
              {{ c.title }}
            </button>
          </div>

          <p class="label">Tipo de lugar</p>
          <div class="chips">
            <button
              type="button"
              class="chip soft"
              *ngFor="let k of kinds"
              [class.on]="placeType === k.id"
              (click)="setType(k.id)"
            >
              {{ k.label }}
            </button>
          </div>

          <p class="label">Filtrar por ciudad</p>
          <div class="chips">
            <button
              type="button"
              class="chip city"
              *ngFor="let c of cityChips"
              [class.on]="cityCode === c.code"
              (click)="setCity(c.code)"
            >
              {{ c.label }}
            </button>
          </div>
          <label class="more">
            Más ciudades
            <select [(ngModel)]="cityCode" (ngModelChange)="reload()">
              <option value="">Todo el país</option>
              <option *ngFor="let c of cities()" [value]="c.code">
                {{ c.name }} — {{ c.department }}
              </option>
            </select>
          </label>
        </div>

        <p class="toast err" *ngIf="error()">{{ error() }}</p>
        <p class="count" *ngIf="!loading()">
          {{ places().length }} lugar{{ places().length === 1 ? '' : 'es' }}
          <span *ngIf="cityLabel()"> · {{ cityLabel() }}</span>
          <span *ngIf="tag"> · {{ needTagLabel(tag) }}</span>
        </p>

        <ul class="feed" *ngIf="places().length; else empty">
          <li *ngFor="let p of places()">
            <article class="card">
              <div class="top">
                <div class="who">
                  <span class="avatar" aria-hidden="true">{{ initials(p.title) }}</span>
                  <div>
                    <h2>{{ p.title }}</h2>
                    <p class="kind">{{ placeTypeLabel(p.type) }}</p>
                  </div>
                </div>
                <span class="urgent" *ngIf="hasUrgent(p)">Necesita apoyo</span>
              </div>
              <p class="desc">{{ p.description || 'Sin detalle adicional. Contacta por su enlace si existe.' }}</p>
              <div class="tags" *ngIf="p.needTags?.length">
                <span *ngFor="let t of p.needTags">{{ needTagLabel(t) }}</span>
              </div>
              <div class="foot">
                <span>{{ p.municipality || 'Colombia' }}<ng-container *ngIf="p.department"> · {{ p.department }}</ng-container></span>
                <span class="trust">Sin verificar</span>
                <span *ngIf="p.updatedAt">{{ p.updatedAt | date: 'd MMM, HH:mm' }}</span>
              </div>
              <div class="actions">
                <a
                  *ngIf="p.externalUrl"
                  class="btn"
                  [href]="p.externalUrl"
                  target="_blank"
                  rel="noopener"
                  >Ir a su canal</a
                >
                <span class="note" *ngIf="!p.externalUrl">Sin enlace externo · solo referencia en esta lista</span>
              </div>
            </article>
          </li>
        </ul>
        <ng-template #empty>
          <div class="empty" *ngIf="!loading()">
            <strong>No hay lugares con esos filtros todavía.</strong>
            <p>
              El directorio es nacional: prueba “Todo el país”, otra categoría, o publica el primer
              punto de tu ciudad.
            </p>
            <a routerLink="/publicar-punto" class="cta">Publicar un lugar</a>
            <a routerLink="/buscar" class="ghost">Cambiar búsqueda</a>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        background: var(--ink);
        color: #f7f3ec;
        padding: 2rem 0 2.1rem;
      }
      .wrap {
        width: min(800px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.72rem;
        opacity: 0.75;
      }
      h1 {
        margin: 0.45rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 5vw, 2.4rem);
        letter-spacing: -0.03em;
        max-width: 16ch;
      }
      .lead {
        margin: 0.7rem 0 0;
        max-width: 40rem;
        font-weight: 600;
        opacity: 0.92;
        line-height: 1.45;
      }
      .stamp {
        margin: 0.6rem 0 0;
        font-size: 0.85rem;
        font-weight: 700;
        opacity: 0.75;
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.15rem;
      }
      .cta,
      .ghost,
      a.cta,
      a.ghost {
        min-height: 46px;
        border-radius: 999px;
        font-weight: 800;
        padding: 0 1.05rem;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        border: 0;
        cursor: pointer;
        font: inherit;
      }
      .cta {
        background: var(--coral);
        color: #fff;
      }
      .ghost {
        background: transparent;
        color: #fff;
        border: 1.5px solid rgba(255, 255, 255, 0.35);
      }
      .body {
        background: var(--cream);
        padding: 1.25rem 0 3rem;
      }
      .filters {
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
      }
      .label {
        margin: 0.55rem 0 0.45rem;
        font-weight: 800;
        font-size: 0.8rem;
        color: var(--muted);
      }
      .label:first-child {
        margin-top: 0;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font-weight: 800;
        font-size: 0.82rem;
        cursor: pointer;
      }
      .chip.on {
        background: #f0c84a;
        border-color: transparent;
        color: #1a1a1a;
      }
      .chip.soft.on {
        background: var(--ink);
        color: #fff;
      }
      .chip.city.on {
        background: #2f6fed;
        color: #fff;
      }
      .more {
        display: grid;
        gap: 0.3rem;
        margin-top: 0.75rem;
        font-weight: 800;
        font-size: 0.8rem;
      }
      .more select {
        min-height: 44px;
        border-radius: 12px;
        border: 1px solid var(--line);
        padding: 0.4rem 0.65rem;
        font: inherit;
        font-weight: 600;
      }
      .count {
        font-weight: 800;
        margin: 0 0 0.85rem;
        color: var(--ink-soft);
      }
      .feed {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.85rem;
      }
      .card {
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 1.05rem;
        box-shadow: 0 10px 28px rgba(16, 35, 63, 0.05);
        display: grid;
        gap: 0.55rem;
      }
      .top {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: flex-start;
      }
      .who {
        display: flex;
        gap: 0.7rem;
        min-width: 0;
      }
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(145deg, var(--coral), var(--teal));
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 800;
        flex: 0 0 auto;
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.15rem;
      }
      .kind {
        margin: 0.15rem 0 0;
        color: #2f6fed;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .urgent {
        background: #e4574c;
        color: #fff;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.35rem 0.55rem;
        border-radius: 999px;
        white-space: nowrap;
      }
      .desc {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
        line-height: 1.4;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
      }
      .tags span {
        background: var(--sky-band);
        border-radius: 999px;
        padding: 0.25rem 0.55rem;
        font-size: 0.75rem;
        font-weight: 800;
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem 0.9rem;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--muted);
      }
      .trust {
        color: var(--teal-deep);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }
      .btn {
        min-height: 40px;
        border-radius: 999px;
        background: var(--teal);
        color: #fff;
        text-decoration: none;
        font-weight: 800;
        padding: 0 0.95rem;
        display: inline-flex;
        align-items: center;
      }
      .note {
        font-size: 0.82rem;
        color: var(--muted);
        font-weight: 600;
      }
      .empty {
        background: #fff;
        border: 1px dashed var(--line);
        border-radius: 18px;
        padding: 1.5rem 1.1rem;
        display: grid;
        gap: 0.55rem;
        justify-items: start;
      }
      .empty strong {
        font-family: var(--font-display);
        font-size: 1.2rem;
      }
      .empty .ghost {
        color: var(--ink);
        border-color: var(--line);
      }
      .toast.err {
        background: #f8d7d3;
        color: var(--coral-deep);
        padding: 0.7rem 0.85rem;
        border-radius: 12px;
        font-weight: 700;
      }
    `,
  ],
})
export class AyudarPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly cats = HELP_CATEGORIES;
  readonly kinds = PLACE_KIND_FILTERS;
  readonly cityChips = CITY_CHIPS;
  readonly cities = signal<CityDto[]>([]);
  readonly places = signal<PlaceDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly updatedHint = signal<string | null>(null);

  tag: NeedTag | '' = '';
  placeType: PlaceType | '' = '';
  cityCode = '';

  readonly placeTypeLabel = placeTypeLabel;
  readonly needTagLabel = needTagLabel;

  ngOnInit(): void {
    this.api.cities().subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => undefined,
    });
    this.route.queryParamMap.subscribe((q) => {
      const tag = q.get('tag') as NeedTag | null;
      const city = q.get('city');
      this.tag = tag && HELP_CATEGORIES.some((c) => c.id === tag) ? tag : '';
      this.cityCode = city && /^\d{5}$/.test(city) ? city : '';
      this.reload();
    });
  }

  setTag(t: NeedTag | ''): void {
    this.tag = t;
    this.reload();
  }

  setType(t: PlaceType | ''): void {
    this.placeType = t;
    this.reload();
  }

  setCity(code: string): void {
    this.cityCode = code;
    this.reload();
  }

  cityLabel(): string | null {
    if (!this.cityCode) return 'Todo el país';
    const chip = CITY_CHIPS.find((c) => c.code === this.cityCode);
    if (chip) return chip.label;
    const c = this.cities().find((x) => x.code === this.cityCode);
    return c ? c.name : this.cityCode;
  }

  hasUrgent(p: PlaceDto): boolean {
    return (p.needTags?.length ?? 0) > 0 || Boolean(p.description?.trim());
  }

  initials(title: string): string {
    const parts = title.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    const params: {
      origin: 'community';
      limit: number;
      cityCode?: string;
      type?: string;
      tag?: string;
    } = { origin: 'community', limit: 200 };
    if (this.cityCode) params.cityCode = this.cityCode;
    if (this.placeType) params.type = this.placeType;
    if (this.tag) params.tag = this.tag;

    this.api.places(params).subscribe({
      next: (res) => {
        let data = res.data;
        const q = this.route.snapshot.queryParamMap.get('q')?.trim().toLowerCase();
        if (q) {
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              (p.description ?? '').toLowerCase().includes(q) ||
              (p.municipality ?? '').toLowerCase().includes(q),
          );
        }
        this.places.set(data);
        this.loading.set(false);
        this.updatedHint.set(new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }));
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No pudimos cargar el directorio. ¿Está el API en :3000?');
      },
    });
  }
}
