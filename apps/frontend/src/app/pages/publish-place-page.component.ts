import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { CityDto, NeedTag, PlaceType } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { HELP_CATEGORIES } from '../help-categories';

const PLACE_TYPES: Array<{ id: PlaceType; label: string; hint: string }> = [
  { id: 'DONATION_POINT', label: 'Acopio / llevar ayuda', hint: 'Reciben especie en un punto' },
  { id: 'HELP_CENTER', label: 'Centro de ayuda', hint: 'Atienden o coordinan ayuda' },
  { id: 'SHELTER', label: 'Albergue', hint: 'Alojamiento temporal' },
  { id: 'VOLUNTEER_POINT', label: 'Voluntariado', hint: 'Necesitan manos / turno' },
  { id: 'MEETING_POINT', label: 'Punto de encuentro', hint: 'Reunión / logística' },
  { id: 'OTHER', label: 'Otro', hint: 'Describe en el texto' },
];

@Component({
  selector: 'aee-publish-place-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Crece con la comunidad</p>
        <h1>Publica un lugar donde ayudar</h1>
        <p class="lead">
          ¿Tu empresa tiene una bodega? ¿Un colegio recibe mercados? ¿Una org abre acopio por unos
          días? Publícalo aquí: ciudad, qué reciben y su canal. Así la gente cercana sabe
          <strong>dónde llevar ayuda</strong>. Nosotros no custodiamos donaciones: solo mostramos el
          punto.
        </p>
        <p class="lead soft">
          Ese registro comunitario es parte fuerte de la plataforma (junto a la API pública): llena
          el vacío donde no hay catálogo oficial de acopios.
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap layout-pub">
        <div class="progress" aria-label="Progreso">
          <span [class.on]="step() >= 1">1 · Tipo</span>
          <span [class.on]="step() >= 2">2 · Texto</span>
          <span [class.on]="step() >= 3">3 · Ciudad y lugar</span>
        </div>

        <div class="card" *ngIf="step() === 1">
          <h2>¿Qué tipo de punto es?</h2>
          <div class="chips">
            <button
              type="button"
              class="chip"
              *ngFor="let t of types"
              [class.on]="type === t.id"
              (click)="type = t.id"
            >
              <strong>{{ t.label }}</strong>
              <small>{{ t.hint }}</small>
            </button>
          </div>
          <button type="button" class="cta" (click)="step.set(2)" [disabled]="!type">
            Continuar
          </button>
        </div>

        <div class="card" *ngIf="step() === 2">
          <h2>Nombre, qué necesitan y etiquetas</h2>
          <p class="hint">Evita inventar cantidades (“500 kits”). Marca qué reciben o necesitan.</p>
          <label>
            Título
            <input [(ngModel)]="title" maxlength="512" placeholder="Ej. Acopio barrio El Prado" />
          </label>
          <label>
            Descripción
            <textarea
              [(ngModel)]="description"
              maxlength="2000"
              rows="4"
              placeholder="Qué reciben o necesitan, horarios, notas útiles…"
            ></textarea>
          </label>
          <div class="chips">
            <button
              type="button"
              class="chip"
              *ngFor="let t of tagOptions"
              [class.on]="selectedTags.has(t.id)"
              (click)="toggleTag(t.id)"
            >
              {{ t.title }}
            </button>
          </div>
          <label>
            Enlace (opcional)
            <input
              [(ngModel)]="externalUrl"
              maxlength="2000"
              placeholder="https://… canal de la org (no es donación a nosotros)"
            />
          </label>
          <div class="row">
            <button type="button" class="ghost" (click)="step.set(1)">Atrás</button>
            <button
              type="button"
              class="cta"
              (click)="step.set(3)"
              [disabled]="title.trim().length < 3"
            >
              Continuar
            </button>
          </div>
        </div>

        <div class="card" *ngIf="step() === 3">
          <h2>Ciudad y ubicación</h2>
          <label>
            Buscar ciudad (DIVIPOLA)
            <input
              [(ngModel)]="cityQuery"
              (ngModelChange)="onCityQuery($event)"
              placeholder="Bogotá, Pereira, Cali…"
            />
          </label>
          <div class="city-list" *ngIf="cities().length">
            <button
              type="button"
              class="city"
              *ngFor="let c of cities()"
              [class.on]="cityCode === c.code"
              (click)="pickCity(c)"
            >
              <strong>{{ c.name }}</strong>
              <small>{{ c.department }} · {{ c.code }}</small>
            </button>
          </div>
          <p class="hint" *ngIf="cityCode">Ciudad elegida: {{ cityLabel }}</p>
          <button type="button" class="loc" (click)="useMyLocation()" [disabled]="locating()">
            {{ locating() ? 'Buscando…' : usedGps() ? 'Ubicación lista' : 'Usar mi ubicación' }}
          </button>
          <p class="hint">
            Este punto se queda en el mapa (sin verificar) hasta que lo ocultes con el enlace de
            cierre. No caduca solo.
          </p>
          <p class="err" *ngIf="error()">{{ error() }}</p>
          <p class="ok" *ngIf="okId()">
            Punto publicado (sin verificar). Ya puede verse en el mapa de Dónde ayudar.
            <a routerLink="/ayudar">Ver en Dónde ayudar</a>
          </p>
          <div class="manage" *ngIf="manageLink()">
            <p>
              <strong>Guarda este enlace</strong> para ocultar el lugar cuando ya no reciba ayudas:
            </p>
            <a [href]="manageLink()">{{ manageLink() }}</a>
            <button type="button" class="copy" (click)="copyManage()">Copiar enlace</button>
          </div>
          <div class="row">
            <button type="button" class="ghost" (click)="step.set(2)" [disabled]="sending()">
              Atrás
            </button>
            <button
              type="button"
              class="cta"
              (click)="submit()"
              [disabled]="!canSubmit() || sending()"
            >
              {{ sending() ? 'Publicando…' : 'Publicar punto' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .layout-pub {
        max-width: 720px;
      }
      .page-hero {
        background: var(--teal);
        color: #f3fffc;
        padding: 2rem 0 2.2rem;
      }
      .wrap {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .wrap.narrow {
        width: min(560px, calc(100% - 1.5rem));
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.78rem;
        opacity: 0.85;
      }
      h1 {
        margin: 0.4rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.8rem, 5vw, 2.6rem);
        letter-spacing: -0.03em;
      }
      .lead {
        margin: 0.7rem 0 0;
        max-width: 40rem;
        font-weight: 600;
        opacity: 0.95;
      }
      .lead.soft {
        opacity: 0.8;
        font-size: 0.98rem;
        font-weight: 500;
      }
      .body {
        background: var(--cream);
        padding: 1.4rem 0 3rem;
      }
      .progress {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 0.9rem;
      }
      .progress span {
        font-size: 0.78rem;
        font-weight: 800;
        padding: 0.35rem 0.65rem;
        border-radius: 999px;
        background: #e8e2d8;
        color: var(--muted);
      }
      .progress span.on {
        background: var(--ink);
        color: #fff;
      }
      .card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 1.15rem;
        box-shadow: var(--shadow);
        display: grid;
        gap: 0.85rem;
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.25rem;
      }
      .hint {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.9rem;
      }
      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 800;
        font-size: 0.85rem;
      }
      input,
      textarea {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 0.75rem 0.85rem;
        font: inherit;
        font-weight: 600;
      }
      .chips {
        display: grid;
        gap: 0.45rem;
      }
      .chip {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 14px;
        padding: 0.75rem 0.9rem;
        cursor: pointer;
        display: grid;
        gap: 0.15rem;
      }
      .chip.on {
        border-color: var(--teal);
        background: #e7f6f3;
      }
      .chip strong {
        font-family: var(--font-display);
      }
      .chip small {
        color: var(--muted);
        font-weight: 600;
      }
      .city-list {
        display: grid;
        gap: 0.35rem;
        max-height: 220px;
        overflow: auto;
      }
      .city {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 12px;
        padding: 0.65rem 0.8rem;
        cursor: pointer;
        display: grid;
      }
      .city.on {
        border-color: var(--teal);
        background: #e7f6f3;
      }
      .city small {
        color: var(--muted);
        font-weight: 600;
      }
      .loc,
      .cta,
      .ghost {
        min-height: 48px;
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
        padding: 0 1.1rem;
      }
      .loc {
        border: 1.5px solid var(--teal);
        background: #fff;
        color: var(--teal-deep);
      }
      .cta {
        border: 0;
        background: var(--teal);
        color: #fff;
      }
      .ghost {
        border: 1px solid var(--line);
        background: #fff;
      }
      .cta:disabled,
      .loc:disabled {
        opacity: 0.55;
      }
      .row {
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
        margin: 0;
      }
      .ok {
        margin: 0;
        font-weight: 700;
        color: var(--teal-deep);
      }
      .ok a {
        color: var(--teal);
        font-weight: 800;
      }
      .manage {
        margin: 0.75rem 0;
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
export class PublishPlacePageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly types = PLACE_TYPES;
  readonly tagOptions = HELP_CATEGORIES;
  readonly selectedTags = new Set<NeedTag>();
  readonly step = signal(1);
  readonly cities = signal<CityDto[]>([]);
  readonly locating = signal(false);
  readonly usedGps = signal(false);
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  readonly okId = signal<string | null>(null);
  readonly manageLink = signal<string | null>(null);

  type: PlaceType = 'DONATION_POINT';
  title = '';
  description = '';
  externalUrl = '';
  cityQuery = '';
  cityCode = '';
  cityLabel = '';
  lng = -74.072;
  lat = 4.711;

  ngOnInit(): void {
    this.loadCities('');
  }

  onCityQuery(q: string): void {
    this.loadCities(q);
  }

  pickCity(c: CityDto): void {
    this.cityCode = c.code;
    this.cityLabel = `${c.name} (${c.department})`;
  }

  toggleTag(id: NeedTag): void {
    if (this.selectedTags.has(id)) this.selectedTags.delete(id);
    else this.selectedTags.add(id);
  }

  private loadCities(q: string): void {
    this.api.cities(q).subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => this.cities.set([]),
    });
  }

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.error.set('No se puede usar la ubicación aquí.');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.locating.set(false);
        this.usedGps.set(true);
        this.lng = pos.coords.longitude;
        this.lat = pos.coords.latitude;
        this.error.set(null);
      },
      () => {
        this.locating.set(false);
        this.error.set('No pudimos leer tu ubicación.');
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  canSubmit(): boolean {
    return this.title.trim().length >= 3 && Boolean(this.cityCode) && Boolean(this.type);
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.sending.set(true);
    this.error.set(null);
    const url = this.externalUrl.trim();
    this.api
      .createPlace({
        type: this.type,
        title: this.title.trim(),
        description: this.description.trim() || undefined,
        cityCode: this.cityCode,
        externalUrl: url || undefined,
        needTags: [...this.selectedTags],
        geometry: { type: 'Point', coordinates: [this.lng, this.lat] },
      })
      .subscribe({
        next: (p) => {
          this.sending.set(false);
          this.okId.set(p.id);
          this.manageLink.set(this.api.manageUrl('place', p.id, p.manageToken));
        },
        error: (err) => {
          this.sending.set(false);
          const m = err?.error?.message;
          this.error.set(
            typeof m === 'string'
              ? m
              : Array.isArray(m)
                ? String(m[0])
                : 'No se pudo publicar. Revisa ciudad, URL y ubicación.',
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
