import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type {
  CityDto,
  PetReportDto,
  PetReportKind,
  PetSpecies,
} from '@aee/shared-types';
import { ApiService } from '../api.service';
import { CITY_CHIPS } from '../help-categories';

@Component({
  selector: 'aee-perdidos-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Colombia · comunidad</p>
        <h1>Perdidos y encontrados</h1>
        <p class="lead">
          Cobertura nacional. Mascotas: publica una señal en tu municipio. Personas: canales
          oficiales (RND/SIRDEC) — sin registro paralelo nuestro.
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap wide">
        <div class="tabs" role="tablist">
          <button
            type="button"
            class="tab"
            [class.on]="tab === 'pets'"
            (click)="setTab('pets')"
          >
            Mascotas
          </button>
          <button
            type="button"
            class="tab"
            [class.on]="tab === 'people'"
            (click)="setTab('people')"
          >
            Personas
          </button>
        </div>

        <ng-container *ngIf="tab === 'people'">
          <p class="intro">
            Para buscar o reportar personas en cualquier zona del país, usa los canales oficiales.
            Así evitamos datos sensibles sin control y no reemplazamos a Medicina Legal.
          </p>
          <ul class="people">
            <li>
              <strong>Consulta de desaparecidos (SIRDEC)</strong>
              <p>Consulta pública nacional.</p>
              <a
                href="https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml"
                target="_blank"
                rel="noopener"
                >Ir a la consulta</a
              >
            </li>
            <li>
              <strong>Portal RND</strong>
              <p>Información del Registro Nacional de Desaparecidos.</p>
              <a
                href="https://www.medicinalegal.gov.co/rnd-registro-de-desaparecidos"
                target="_blank"
                rel="noopener"
                >Abrir portal</a
              >
            </li>
            <li>
              <strong>Líneas de atención</strong>
              <p>123 (urgencia) · 141 (ICBF / niñez) · 155 (violencia de género).</p>
              <div class="row-links">
                <a href="tel:123">123</a>
                <a href="tel:141">141</a>
                <a href="tel:155">155</a>
              </div>
            </li>
          </ul>
          <p class="hint-foot">
            Más canales del país en <a routerLink="/origenes">Orígenes</a>.
          </p>
        </ng-container>

        <ng-container *ngIf="tab === 'pets'">
          <p class="intro">
            Señales de todo el país (sin verificar). Filtra por ciudad si quieres, o deja
            <strong>Todo el país</strong>. Al publicar, elige el municipio (no hace falta estar en
            Bogotá).
          </p>

          <div class="filters panel">
            <div class="chips">
              <button type="button" class="chip" [class.on]="!kind" (click)="setKind(null)">
                Todas
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="kind === 'LOST'"
                (click)="setKind('LOST')"
              >
                Perdidas
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="kind === 'FOUND'"
                (click)="setKind('FOUND')"
              >
                Encontradas
              </button>
            </div>
            <p class="label">Zona</p>
            <div class="chips">
              <button
                type="button"
                class="chip soft"
                *ngFor="let c of cityChips"
                [class.on]="filterCity === c.code"
                (click)="setFilterCity(c.code)"
              >
                {{ c.label }}
              </button>
            </div>
            <button type="button" class="cta" (click)="showForm.set(!showForm())">
              {{ showForm() ? 'Cerrar formulario' : 'Publicar mascota' }}
            </button>
          </div>

          <form class="panel form" *ngIf="showForm()" (ngSubmit)="publish()">
            <p class="label">¿Perdida o encontrada?</p>
            <div class="chips">
              <button
                type="button"
                class="chip"
                [class.on]="formKind === 'LOST'"
                (click)="formKind = 'LOST'"
              >
                La perdí
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="formKind === 'FOUND'"
                (click)="formKind = 'FOUND'"
              >
                La encontré
              </button>
            </div>
            <p class="label">Especie</p>
            <div class="chips">
              <button
                type="button"
                class="chip soft"
                *ngFor="let s of speciesOpts"
                [class.on]="formSpecies === s.id"
                (click)="formSpecies = s.id"
              >
                {{ s.label }}
              </button>
            </div>
            <label>
              Municipio (cualquier ciudad de Colombia)
              <input
                [(ngModel)]="cityQuery"
                name="cityQuery"
                (ngModelChange)="onCityQuery($event)"
                placeholder="Escribe: Pasto, Cali, Quibdó, Leticia…"
                autocomplete="off"
              />
            </label>
            <ul class="city-hits" *ngIf="cityHits().length && !formCity">
              <li *ngFor="let c of cityHits()">
                <button type="button" (click)="pickCity(c)">
                  {{ c.name }} — {{ c.department }}
                </button>
              </li>
            </ul>
            <p class="picked" *ngIf="formCityLabel()">Municipio: {{ formCityLabel() }}</p>
            <label>
              Descripción
              <textarea
                [(ngModel)]="formDesc"
                name="desc"
                rows="4"
                maxlength="2000"
                placeholder="Raza, color, collar, barrio o vereda, cuándo se vio…"
              ></textarea>
            </label>
            <label>
              WhatsApp (opcional)
              <input
                [(ngModel)]="formWa"
                name="wa"
                maxlength="20"
                placeholder="3001234567"
              />
            </label>
            <p class="err" *ngIf="formError()">{{ formError() }}</p>
            <p class="ok" *ngIf="ok()">{{ ok() }}</p>
            <div class="manage" *ngIf="manageLink()">
              <p>
                <strong>Guarda este enlace</strong> para marcar que ya apareció / cerrar el aviso:
              </p>
              <a [href]="manageLink()">{{ manageLink() }}</a>
              <button type="button" class="copy" (click)="copyManage()">Copiar enlace</button>
            </div>
            <button type="submit" class="cta" [disabled]="posting()">
              {{ posting() ? 'Publicando…' : 'Publicar señal' }}
            </button>
          </form>

          <p class="err" *ngIf="listError()">{{ listError() }}</p>
          <p class="count" *ngIf="!loading()">
            {{ pets().length }} aviso{{ pets().length === 1 ? '' : 's' }}
          </p>
          <ul class="feed" *ngIf="pets().length; else empty">
            <li *ngFor="let p of pets()">
              <article>
                <div class="top">
                  <span class="tag" [class.found]="p.kind === 'FOUND'">{{
                    p.kind === 'LOST' ? 'Perdida' : 'Encontrada'
                  }}</span>
                  <span class="sp">{{ speciesLabel(p.species) }}</span>
                </div>
                <p class="desc">{{ p.description }}</p>
                <div class="foot">
                  <span>{{ p.municipality || 'Colombia' }}</span>
                  <span>{{ p.createdAt | date: 'd MMM, HH:mm' }}</span>
                </div>
                <a
                  *ngIf="p.contactWhatsapp"
                  class="wa"
                  [href]="waUrl(p)"
                  target="_blank"
                  rel="noopener"
                  >WhatsApp</a
                >
              </article>
            </li>
          </ul>
          <ng-template #empty>
            <div class="empty" *ngIf="!loading()">
              <strong>Aún no hay avisos con esos filtros.</strong>
              <p>Puedes publicar desde cualquier municipio del país.</p>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </section>
  `,
  styles: [
    `
      .page-wrap.wide {
        width: min(900px, calc(100% - 1.5rem));
      }
      .tabs {
        display: flex;
        gap: 0.35rem;
        margin-bottom: 1rem;
      }
      .tab {
        flex: 1;
        min-height: 44px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: var(--white);
        font-weight: 800;
        cursor: pointer;
      }
      .tab.on {
        background: var(--ink);
        border-color: var(--ink);
        color: #fff;
      }
      .intro {
        margin: 0 0 1rem;
        font-weight: 600;
        color: var(--muted);
        line-height: 1.45;
      }
      .people {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.75rem;
      }
      .people li {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.1rem;
      }
      .people strong {
        font-family: var(--font-display);
        font-size: 1.15rem;
      }
      .people p {
        margin: 0.35rem 0 0;
        color: var(--muted);
        font-weight: 500;
      }
      .people a,
      .hint-foot a {
        display: inline-block;
        margin-top: 0.55rem;
        font-weight: 800;
        color: var(--teal);
        text-decoration: none;
      }
      .row-links {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
      .row-links a {
        margin-top: 0;
      }
      .hint-foot {
        margin: 1.2rem 0 0;
        font-weight: 600;
        color: var(--muted);
      }
      .panel {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem;
        margin-bottom: 0.9rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.65rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font-weight: 800;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .chip.on {
        background: #f0c84a;
        border-color: transparent;
      }
      .chip.soft.on {
        background: var(--ink);
        color: #fff;
      }
      .cta {
        min-height: 44px;
        border: 0;
        border-radius: 999px;
        background: var(--coral);
        color: #fff;
        font-weight: 800;
        padding: 0 1.1rem;
        cursor: pointer;
      }
      .cta:disabled {
        opacity: 0.6;
      }
      .form label {
        display: grid;
        gap: 0.35rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
      .form textarea,
      .form input,
      .form select {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 0.7rem 0.8rem;
        font: inherit;
      }
      .city-hits {
        list-style: none;
        margin: -0.35rem 0 0.75rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 12px;
        overflow: hidden;
        max-height: 220px;
        overflow-y: auto;
      }
      .city-hits button {
        width: 100%;
        text-align: left;
        border: 0;
        border-bottom: 1px solid var(--line);
        background: var(--cream);
        padding: 0.65rem 0.8rem;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      .city-hits li:last-child button {
        border-bottom: 0;
      }
      .picked {
        margin: 0 0 0.75rem;
        font-weight: 800;
        color: var(--teal-deep);
      }
      .label {
        margin: 0 0 0.4rem;
        font-weight: 800;
        font-size: 0.85rem;
        color: var(--muted);
      }
      .feed {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.7rem;
      }
      .feed article {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem;
      }
      .top {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .tag {
        font-size: 0.75rem;
        font-weight: 800;
        padding: 0.25rem 0.55rem;
        border-radius: 999px;
        background: #f8d7d3;
        color: var(--coral-deep);
      }
      .tag.found {
        background: #d8f0ec;
        color: var(--teal-deep);
      }
      .sp {
        font-weight: 700;
        color: var(--muted);
        font-size: 0.9rem;
      }
      .desc {
        margin: 0.55rem 0 0;
        font-weight: 500;
        line-height: 1.45;
      }
      .foot {
        margin-top: 0.55rem;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--muted);
      }
      .wa {
        display: inline-flex;
        margin-top: 0.65rem;
        min-height: 40px;
        align-items: center;
        padding: 0 0.95rem;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        text-decoration: none;
      }
      .count {
        font-weight: 700;
        color: var(--muted);
        margin: 0 0 0.65rem;
      }
      .empty {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.2rem;
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
      }
      .ok {
        color: var(--teal-deep);
        font-weight: 800;
      }
      .manage {
        margin: 0.5rem 0 0.75rem;
        padding: 0.75rem;
        border-radius: 12px;
        background: #eef7f5;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .manage a {
        display: block;
        margin: 0.35rem 0;
        word-break: break-all;
        color: var(--teal);
        font-weight: 800;
      }
      .manage .copy {
        border: 0;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        padding: 0.4rem 0.85rem;
        cursor: pointer;
      }
    `,
  ],
})
export class PerdidosPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  tab: 'pets' | 'people' = 'pets';
  kind: PetReportKind | null = null;
  filterCity = '';
  readonly cityChips = CITY_CHIPS;
  readonly cityHits = signal<CityDto[]>([]);
  readonly pets = signal<PetReportDto[]>([]);
  readonly loading = signal(false);
  readonly posting = signal(false);
  readonly showForm = signal(false);
  readonly listError = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly ok = signal<string | null>(null);
  readonly manageLink = signal<string | null>(null);
  readonly formCityLabel = signal('');

  formKind: PetReportKind = 'LOST';
  formSpecies: PetSpecies = 'DOG';
  formCity = '';
  cityQuery = '';
  formDesc = '';
  formWa = '';

  readonly speciesOpts: Array<{ id: PetSpecies; label: string }> = [
    { id: 'DOG', label: 'Perro' },
    { id: 'CAT', label: 'Gato' },
    { id: 'OTHER', label: 'Otra' },
  ];

  ngOnInit(): void {
    this.reload();
  }

  setTab(t: 'pets' | 'people'): void {
    this.tab = t;
  }

  setKind(k: PetReportKind | null): void {
    this.kind = k;
    this.reload();
  }

  setFilterCity(code: string): void {
    this.filterCity = code;
    this.reload();
  }

  onCityQuery(q: string): void {
    this.formCity = '';
    this.formCityLabel.set('');
    const term = q.trim();
    if (term.length < 2) {
      this.cityHits.set([]);
      return;
    }
    this.api.cities(term).subscribe({
      next: (r) => this.cityHits.set(r.data.slice(0, 12)),
      error: () => this.cityHits.set([]),
    });
  }

  pickCity(c: CityDto): void {
    this.formCity = c.code;
    this.formCityLabel.set(`${c.name} — ${c.department}`);
    this.cityQuery = c.name;
    this.cityHits.set([]);
  }

  speciesLabel(s: PetSpecies): string {
    return this.speciesOpts.find((x) => x.id === s)?.label ?? s;
  }

  waUrl(p: PetReportDto): string {
    const phone = (p.contactWhatsapp ?? '').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hola, vi tu aviso de mascota ${p.kind === 'LOST' ? 'perdida' : 'encontrada'} en Ayuda en Emergencias.`,
    );
    return `https://wa.me/${phone}?text=${text}`;
  }

  reload(): void {
    this.loading.set(true);
    this.listError.set(null);
    this.api
      .pets({
        kind: this.kind ?? undefined,
        cityCode: this.filterCity || undefined,
      })
      .subscribe({
        next: (r) => {
          this.pets.set(r.data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.listError.set('No pudimos cargar los avisos. ¿API en :3000?');
        },
      });
  }

  publish(): void {
    this.formError.set(null);
    this.ok.set(null);
    this.manageLink.set(null);
    if (!this.formCity) {
      this.formError.set('Busca y elige un municipio de la lista.');
      return;
    }
    if (this.formDesc.trim().length < 8) {
      this.formError.set('Describe un poco más la mascota.');
      return;
    }
    this.posting.set(true);
    this.api
      .createPet({
        kind: this.formKind,
        species: this.formSpecies,
        description: this.formDesc.trim(),
        cityCode: this.formCity,
        contactWhatsapp: this.formWa.trim() || undefined,
      })
      .subscribe({
        next: (r) => {
          this.posting.set(false);
          this.ok.set('Publicado. Guarda el enlace de cierre.');
          this.manageLink.set(this.api.manageUrl('pet', r.id, r.manageToken));
          this.formDesc = '';
          this.formWa = '';
          this.formCity = '';
          this.formCityLabel.set('');
          this.cityQuery = '';
          this.reload();
        },
        error: (err) => {
          this.posting.set(false);
          const msg =
            err?.error?.message ??
            (Array.isArray(err?.error?.message) ? err.error.message.join(', ') : null);
          this.formError.set(
            typeof msg === 'string' ? msg : 'No se pudo publicar. Revisa los datos.',
          );
        },
      });
  }

  copyManage(): void {
    const link = this.manageLink();
    if (!link) return;
    void navigator.clipboard?.writeText(`${window.location.origin}${link}`);
  }
}
