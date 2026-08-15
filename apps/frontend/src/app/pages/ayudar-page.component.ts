import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import type { CityDto, NeedTag, PlaceDto, PlaceType } from '@aee/shared-types';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import { ApiService } from '../api.service';
import {
  CITY_CHIPS,
  HELP_CATEGORIES,
  PLACE_KIND_FILTERS,
  needTagLabel,
} from '../help-categories';
import { placeTypeLabel } from '../plain-labels';

const CO_BOUNDS: [[number, number], [number, number]] = [
  [-79.2, -4.3],
  [-66.8, 13.5],
];

@Component({
  selector: 'aee-ayudar-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap hero-grid">
        <div>
          <p class="kicker">Quiero ayudar</p>
          <h1>Dónde y cómo ayudar</h1>
          <p class="lead">
            Acopios, albergues, centros y orgs. Filtra por lo que puedes llevar o el tipo de lugar, y
            abre <strong>su canal</strong> o Cómo llegar. Nosotros
            <strong>no recibimos ni custodiamos</strong> ayudas ni dinero.
          </p>
          <p class="stamp" *ngIf="updatedHint()">Actualizado: {{ updatedHint() }}</p>
          <div class="toolbar">
            <a class="cta" routerLink="/publicar-punto">Publicar un lugar</a>
            <a class="ghost" routerLink="/buscar">¿Qué necesitas?</a>
          </div>
        </div>
        <aside class="hero-side panel-card">
          <p class="side-k">Cómo ayudar</p>
          <ul>
            <li>Elige qué puedes llevar o el tipo de lugar</li>
            <li>Abre el canal de la org (todo ocurre allá)</li>
            <li>O usa Cómo llegar si hay punto en mapa</li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap layout">
        <div class="main-col">
          <p class="disclaimer">
            Solo enlazamos lugares y canales de terceros. No pedimos dinero aquí, no gestionamos
            turnos ni garantizamos que un punto siga abierto: confirma siempre en su sitio o al
            llegar.
          </p>

          <div class="filters panel-card">
            <p class="label">Qué se necesita / puedes llevar</p>
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

            <p class="label">Ciudad</p>
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
            <span *ngIf="placeType"> · {{ placeTypeLabel(placeType) }}</span>
          </p>

          <ul class="feed" *ngIf="places().length; else empty">
            <li *ngFor="let p of places()">
              <article class="card" (click)="focusPlace(p)">
                <div class="top">
                  <div class="who">
                    <span class="avatar" aria-hidden="true">{{ initials(p.title) }}</span>
                    <div>
                      <h2>{{ p.title }}</h2>
                      <p class="kind">{{ placeTypeLabel(p.type) }}</p>
                    </div>
                  </div>
                </div>
                <p class="desc">{{ cleanDesc(p.description) }}</p>
                <p class="how" *ngIf="howToHelp(p)">{{ howToHelp(p) }}</p>
                <div class="tags" *ngIf="p.needTags?.length">
                  <span *ngFor="let t of p.needTags">{{ needTagLabel(t) }}</span>
                </div>
                <div class="foot">
                  <span
                    >{{ p.municipality || 'Colombia'
                    }}<ng-container *ngIf="p.department"> · {{ p.department }}</ng-container></span
                  >
                  <span *ngIf="p.updatedAt">{{ p.updatedAt | date: 'd MMM, HH:mm' }}</span>
                </div>
                <div class="actions" (click)="$event.stopPropagation()">
                  <a
                    *ngIf="p.externalUrl"
                    class="btn"
                    [href]="p.externalUrl"
                    target="_blank"
                    rel="noopener"
                    >Cómo ayudar (su canal)</a
                  >
                  <button type="button" class="btn soft" (click)="openDirections(p)">
                    Cómo llegar
                  </button>
                </div>
              </article>
            </li>
          </ul>
          <ng-template #empty>
            <div class="empty panel-card" *ngIf="!loading()">
              <strong>No hay lugares con esos filtros todavía.</strong>
              <p>Prueba otra ciudad, otro tipo, o publica un punto de acopio.</p>
              <a routerLink="/publicar-punto" class="cta">Publicar un lugar</a>
            </div>
          </ng-template>
        </div>

        <aside class="side-col">
          <div class="mini-map panel-card" aria-label="Mapa de orientación">
            <div class="map-head">
              <strong>Mapa guía</strong>
              <span>Complemento</span>
            </div>
            <div #mapHost class="map-host"></div>
          </div>
          <p class="sources-note">
            Datos de orgs públicas, comunidad y catálogos abiertos.
            <a routerLink="/fuentes-detalle">Ver fuentes</a>
          </p>
        </aside>
      </div>
    </section>

    <div class="modal" *ngIf="directions()" role="dialog" aria-modal="true" [attr.aria-label]="'Cómo llegar'">
      <button type="button" class="backdrop" (click)="closeDirections()" aria-label="Cerrar"></button>
      <div class="modal-panel">
        <div class="modal-head">
          <div>
            <p class="mk">Cómo llegar</p>
            <h3>{{ directions()!.title }}</h3>
            <p class="msub">
              {{ directions()!.municipality || 'Colombia'
              }}<ng-container *ngIf="directions()!.department">
                · {{ directions()!.department }}</ng-container
              >
            </p>
          </div>
          <button type="button" class="x" (click)="closeDirections()">Cerrar</button>
        </div>
        <iframe
          class="embed"
          title="Mapa del lugar"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          [src]="directionsEmbedUrl()"
        ></iframe>
        <div class="modal-actions">
          <a class="btn" [href]="mapsUrl(directions()!)" target="_blank" rel="noopener"
            >Abrir en Google Maps</a
          >
          <button type="button" class="btn soft" (click)="closeDirections()">Listo</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hero-grid {
        display: grid;
        gap: 1.2rem;
        position: relative;
        z-index: 1;
      }
      @media (min-width: 900px) {
        .hero-grid {
          grid-template-columns: 1.45fr 0.8fr;
        }
      }
      .stamp {
        margin: 0.55rem 0 0;
        font-size: 0.85rem;
        font-weight: 700;
        opacity: 0.75;
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.1rem;
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
      .hero-side {
        background: rgba(255, 252, 247, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.14) !important;
        color: #f7f3ec;
        box-shadow: none !important;
      }
      .side-k {
        margin: 0;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.7;
      }
      .hero-side ul {
        margin: 0.7rem 0 0;
        padding-left: 1.1rem;
        font-weight: 600;
      }
      .layout {
        display: grid;
        gap: 1.1rem;
      }
      @media (min-width: 980px) {
        .layout {
          grid-template-columns: 1.35fr 0.75fr;
          align-items: start;
        }
        .side-col {
          position: sticky;
          top: calc(var(--nav-h) + 0.75rem);
        }
      }
      .disclaimer {
        margin: 0 0 0.85rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--muted);
        line-height: 1.4;
      }
      .how {
        margin: 0.45rem 0 0;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--teal-deep, #0f6e6a);
        line-height: 1.35;
      }
      .filters {
        margin-bottom: 0.85rem;
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
      .map-head {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem 0.75rem;
        align-items: baseline;
        padding: 0 0 0.65rem;
      }
      .map-head strong {
        font-family: var(--font-display);
      }
      .map-head span {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--muted);
      }
      .map-host {
        height: 280px;
        width: 100%;
        border-radius: 14px;
        overflow: hidden;
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
        cursor: pointer;
      }
      .top {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
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
        font-size: 0.88rem;
        border: 0;
        cursor: pointer;
        font: inherit;
      }
      .btn.soft {
        background: #fff;
        color: var(--ink);
        border: 1px solid var(--line);
      }
      .empty {
        display: grid;
        gap: 0.55rem;
        justify-items: start;
      }
      .toast.err {
        background: #f8d7d3;
        color: var(--coral-deep);
        padding: 0.7rem 0.85rem;
        border-radius: 12px;
        font-weight: 700;
      }
      .sources-note {
        margin: 0.85rem 0 0;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--muted);
      }
      .sources-note a {
        color: var(--teal);
        font-weight: 800;
      }
      .modal {
        position: fixed;
        inset: 0;
        z-index: 80;
        display: grid;
        place-items: end center;
        padding: 0.75rem;
      }
      @media (min-width: 720px) {
        .modal {
          place-items: center;
        }
      }
      .backdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: rgba(16, 35, 63, 0.55);
        cursor: pointer;
      }
      .modal-panel {
        position: relative;
        width: min(640px, 100%);
        background: #fff;
        border-radius: 20px 20px 12px 12px;
        padding: 1rem;
        box-shadow: var(--shadow);
        display: grid;
        gap: 0.75rem;
        max-height: min(90dvh, 720px);
      }
      .modal-head {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: start;
      }
      .mk {
        margin: 0;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--teal);
      }
      .modal-head h3 {
        margin: 0.2rem 0 0;
        font-family: var(--font-display);
        font-size: 1.2rem;
      }
      .msub {
        margin: 0.25rem 0 0;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.88rem;
      }
      .x {
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 999px;
        min-height: 40px;
        padding: 0 0.9rem;
        font-weight: 800;
        cursor: pointer;
      }
      .embed {
        width: 100%;
        height: min(42vh, 320px);
        border: 0;
        border-radius: 14px;
        background: var(--cream-2);
      }
      .modal-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `,
  ],
})
export class AyudarPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapHost') mapHost?: ElementRef<HTMLDivElement>;

  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private map: Map | null = null;
  private markers: Marker[] = [];

  readonly cats = HELP_CATEGORIES;
  readonly kinds = PLACE_KIND_FILTERS;
  readonly cityChips = CITY_CHIPS;
  readonly cities = signal<CityDto[]>([]);
  readonly places = signal<PlaceDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly updatedHint = signal<string | null>(null);
  readonly directions = signal<PlaceDto | null>(null);

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
      const type = q.get('type') as PlaceType | null;
      this.tag = tag && HELP_CATEGORIES.some((c) => c.id === tag) ? tag : '';
      this.cityCode = city && /^\d{5}$/.test(city) ? city : '';
      this.placeType =
        type && PLACE_KIND_FILTERS.some((k) => k.id === type) ? type : '';
      this.reload();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.syncMarkers();
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.map?.remove();
    this.map = null;
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

  howToHelp(p: PlaceDto): string {
    if (p.type === 'DONATION_POINT') {
      return p.externalUrl
        ? 'Cómo ayudar: lleva lo que indiquen en su canal (especie / acopio). No enviamos dinero nosotros.'
        : 'Cómo ayudar: confirma en el lugar qué reciben antes de llevar.';
    }
    if (p.type === 'VOLUNTEER_POINT') {
      return 'Cómo ayudar: consulta en su canal turnos o requisitos de voluntariado.';
    }
    if (p.type === 'SHELTER') {
      return 'Cómo ayudar: pregunta en su canal qué se puede llevar o si necesitan manos.';
    }
    if (p.type === 'HELP_CENTER') {
      return p.externalUrl
        ? 'Cómo ayudar: entra a su canal para sedes, voluntariado o qué reciben.'
        : 'Cómo ayudar: contacta el centro directamente.';
    }
    if (p.type === 'MEDICAL') {
      return 'Orientación de salud: no es un punto de acopio; usa el canal oficial si existe.';
    }
    return p.externalUrl ? 'Cómo ayudar: abre su canal para instrucciones.' : '';
  }

  cityLabel(): string | null {
    if (!this.cityCode) return 'Todo el país';
    const chip = CITY_CHIPS.find((c) => c.code === this.cityCode);
    if (chip) return chip.label;
    const c = this.cities().find((x) => x.code === this.cityCode);
    return c ? c.name : this.cityCode;
  }

  initials(title: string): string {
    const parts = title.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
  }

  cleanDesc(description: string | null | undefined): string {
    const raw = (description ?? '').trim();
    if (!raw) return 'Abre su canal o usa Cómo llegar para ubicarlo.';
    return raw
      .replace(/\bOpenStreetMap\b/gi, '')
      .replace(/\bOSM\b/g, '')
      .replace(/\(\s*\)/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s·\s·/g, ' · ')
      .replace(/^[\s·]+|[\s·]+$/g, '')
      .trim();
  }

  coords(p: PlaceDto): [number, number] | null {
    const g = p.geometry;
    if (!g || g.type !== 'Point' || !Array.isArray(g.coordinates)) return null;
    const lng = Number(g.coordinates[0]);
    const lat = Number(g.coordinates[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return [lng, lat];
  }

  mapsUrl(p: PlaceDto): string {
    const c = this.coords(p);
    if (!c) return 'https://www.google.com/maps';
    return `https://www.google.com/maps/search/?api=1&query=${c[1]},${c[0]}`;
  }

  openDirections(p: PlaceDto): void {
    this.directions.set(p);
    this.focusPlace(p);
  }

  closeDirections(): void {
    this.directions.set(null);
  }

  directionsEmbedUrl(): SafeResourceUrl {
    const p = this.directions();
    const c = p ? this.coords(p) : null;
    const q = c ? `${c[1]},${c[0]}` : 'Colombia';
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  focusPlace(p: PlaceDto): void {
    const c = this.coords(p);
    if (!c || !this.map) return;
    this.map.flyTo({ center: c, zoom: Math.max(this.map.getZoom(), 13), essential: true });
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.updatedHint.set(
      new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }),
    );

    const params: {
      origin: 'all';
      helpOnly: boolean;
      limit: number;
      cityCode?: string;
      type?: string;
      tag?: string;
    } = { origin: 'all', helpOnly: true, limit: 200 };
    if (this.cityCode) params.cityCode = this.cityCode;
    if (this.placeType) {
      params.type = this.placeType;
      params.helpOnly = this.placeType !== 'MEDICAL';
      if (this.placeType === 'MEDICAL') params.helpOnly = false;
    }
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
        data = data.filter((p) => !isLowSignalPlace(p));
        data = [...data].sort((a, b) => scorePlace(b) - scorePlace(a));
        this.places.set(data);
        this.loading.set(false);
        queueMicrotask(() => this.syncMarkers());
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No pudimos cargar el directorio. ¿Está el API en :3000?');
      },
    });
  }

  private initMap(): void {
    if (!this.mapHost?.nativeElement || this.map) return;
    this.map = new maplibregl.Map({
      container: this.mapHost.nativeElement,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© colaboradores del mapa',
          },
        },
        layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
      },
      bounds: CO_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      attributionControl: false,
    });
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    this.map.on('load', () => this.map?.resize());
  }

  private syncMarkers(): void {
    if (!this.map) this.initMap();
    if (!this.map) return;
    this.clearMarkers();
    const bounds = new maplibregl.LngLatBounds();
    let n = 0;
    for (const p of this.places().slice(0, 80)) {
      const c = this.coords(p);
      if (!c) continue;
      const color =
        p.type === 'DONATION_POINT'
          ? '#e4574c'
          : p.type === 'VOLUNTEER_POINT'
            ? '#0f6e6a'
            : p.type === 'SHELTER'
              ? '#2f6fed'
              : p.type === 'MEDICAL'
                ? '#1c64a0'
                : '#b47828';
      const el = document.createElement('div');
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.background = color;
      el.style.border = '2px solid #fff';
      el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.25)';
      this.markers.push(
        new maplibregl.Marker({ element: el })
          .setLngLat(c)
          .setPopup(
            new maplibregl.Popup({ offset: 10 }).setHTML(
              `<strong>${esc(p.title)}</strong><br/>${esc(placeTypeLabel(p.type))}`,
            ),
          )
          .addTo(this.map),
      );
      bounds.extend(c);
      n += 1;
    }
    if (n === 1) {
      this.map.flyTo({ center: bounds.getCenter(), zoom: 12, essential: true });
    } else if (n > 1) {
      this.map.fitBounds(bounds, { padding: 36, maxZoom: 12, duration: 500 });
    } else {
      this.map.fitBounds(CO_BOUNDS, { padding: 20 });
    }
    queueMicrotask(() => this.map?.resize());
  }

  private clearMarkers(): void {
    for (const m of this.markers) m.remove();
    this.markers = [];
  }
}

function isLowSignalPlace(p: PlaceDto): boolean {
  const t = p.title.toLowerCase();
  // Salones comunales / eventos genéricos saturan y no son “dónde ayudar” accionable.
  if (/sal[oó]n comunal|casa de eventos|c[aá]mara de comercio|federaci[oó]n nacional de cafeteros/i.test(t)) {
    return true;
  }
  return false;
}

function scorePlace(p: PlaceDto): number {
  let s = 0;
  if (p.sourceId === 'curated') s += 30;
  if (p.sourceId === 'community') s += 20;
  if (p.externalUrl) s += 10;
  if (p.needTags?.length) s += p.needTags.length * 2;
  if (p.type === 'DONATION_POINT' || p.type === 'VOLUNTEER_POINT' || p.type === 'SHELTER') s += 8;
  if (p.type === 'HELP_CENTER') s += 6;
  if (/cruz roja|banco de alimentos|defensa civil|bomberos|hemocentro|techo/i.test(p.title)) {
    s += 25;
  }
  return s;
}

function esc(v: string): string {
  return v
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
