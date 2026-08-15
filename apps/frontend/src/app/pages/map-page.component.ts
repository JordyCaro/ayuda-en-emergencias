import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import type { CityDto, EventDto, NeedDto, PlaceDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import {
  NEED_CATS,
  eventPlainDetail,
  eventPlainTitle,
  placeTypeLabel,
} from '../plain-labels';

/** Vista principal: lo que la gente busca primero (como Colombia Ayuda). */
type MainTab = 'apoyo' | 'avisos' | 'oficial';

type NearItem = {
  id: string;
  kind: 'punto' | 'aviso' | 'alerta' | 'salud';
  title: string;
  detail: string;
  trust: string;
  lng: number;
  lat: number;
  href?: string | null;
  cityLabel?: string | null;
};

const CO_BOUNDS: [[number, number], [number, number]] = [
  [-79.2, -4.3],
  [-66.8, 13.5],
];

@Component({
  selector: 'aee-map-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="page-hero">
      <div class="wrap">
        <p class="kicker">Colombia · mapa de ayuda</p>
        <h1>¿Quién necesita apoyo y qué está pasando?</h1>
        <p class="lead">
          Primero ves <strong>lugares / organizaciones</strong> y
          <strong>avisos de personas</strong>. Las IPS de salud y las alertas IDEAM son capas
          aparte (no saturan el mapa). No operamos donaciones.
        </p>
        <div class="toolbar">
          <a class="cta" routerLink="/publicar-punto">Publicar un lugar</a>
          <a class="ghost" routerLink="/necesito-ayuda">Dejar un aviso</a>
          <button type="button" class="ghost" (click)="locateMe(true)" [disabled]="locating()">
            {{ locating() ? 'Buscando…' : 'Cerca de mí' }}
          </button>
          <button type="button" class="ghost" (click)="showAllColombia()">Ver todo el país</button>
        </div>
      </div>
    </section>

    <section class="body">
      <div class="wrap">
        <div class="tabs" role="tablist" aria-label="Qué quieres ver">
          <button
            type="button"
            role="tab"
            [class.on]="tab() === 'apoyo'"
            (click)="setTab('apoyo')"
          >
            Lugares que piden apoyo
            <span class="count">{{ places().length }}</span>
          </button>
          <button
            type="button"
            role="tab"
            [class.on]="tab() === 'avisos'"
            (click)="setTab('avisos')"
          >
            Avisos de la gente
            <span class="count">{{ avisos().length }}</span>
          </button>
          <button
            type="button"
            role="tab"
            [class.on]="tab() === 'oficial'"
            (click)="setTab('oficial')"
          >
            Alertas y salud
            <span class="count">{{ officialCount() }}</span>
          </button>
        </div>

        <div class="panel" *ngIf="tab() === 'apoyo'">
          <div class="panel-head">
            <div>
              <h2>Organizaciones y puntos de ayuda</h2>
              <p>
                Acopios, albergues, voluntariado, ONG. Publicado por la comunidad ·
                <strong>sin verificar</strong>. Si hay enlace, donas en su canal — no aquí.
              </p>
            </div>
            <label class="city">
              Ciudad
              <select [(ngModel)]="cityCode" (ngModelChange)="reloadPlaces()">
                <option value="">Todo el país</option>
                <option *ngFor="let c of cities()" [value]="c.code">
                  {{ c.name }} — {{ c.department }}
                </option>
              </select>
            </label>
          </div>

          <p class="toast err" *ngIf="error()">{{ error() }}</p>
          <p class="toast" *ngIf="status()">{{ status() }}</p>

          <ul class="cards" *ngIf="places().length; else emptyPlaces">
            <li *ngFor="let p of places()">
              <article class="card punto">
                <span class="badge">{{ placeTypeLabel(p.type) }}</span>
                <h3>{{ p.title }}</h3>
                <p class="desc">{{ p.description || 'Sin descripción adicional.' }}</p>
                <p class="meta">
                  {{ p.municipality || 'Colombia' }}
                  <span *ngIf="p.department"> · {{ p.department }}</span>
                  <span *ngIf="p.updatedAt"> · act. {{ p.updatedAt | date: 'd MMM' }}</span>
                </p>
                <p class="trust">Comunidad · sin verificar</p>
                <div class="actions">
                  <button type="button" class="mini" (click)="focusPlace(p)">Ver en mapa</button>
                  <a
                    *ngIf="p.externalUrl"
                    class="mini link"
                    [href]="p.externalUrl"
                    target="_blank"
                    rel="noopener"
                    >Su enlace</a
                  >
                </div>
              </article>
            </li>
          </ul>
          <ng-template #emptyPlaces>
            <div class="empty" *ngIf="!loading()">
              <strong>Aún no hay lugares publicados{{ cityCode ? ' en esa ciudad' : '' }}.</strong>
              <p>
                Esta es la lista tipo “quién necesita apoyo”. Sé el primero en tu zona — no pedimos
                donaciones nosotros.
              </p>
              <a routerLink="/publicar-punto" class="cta inline">Publicar un lugar</a>
            </div>
          </ng-template>
        </div>

        <div class="panel" *ngIf="tab() === 'avisos'">
          <div class="panel-head">
            <div>
              <h2>Avisos de personas</h2>
              <p>
                Comentarios en el mapa (“aquí hace falta agua / manos…”). Son
                <strong>señales</strong>, no pedidos que prometamos cumplir.
              </p>
            </div>
            <a routerLink="/necesito-ayuda" class="cta inline">Dejar aviso</a>
          </div>
          <ul class="cards" *ngIf="avisos().length; else emptyAvisos">
            <li *ngFor="let n of avisos()">
              <article class="card aviso">
                <span class="badge">{{ needTitle(n) }}</span>
                <h3>{{ n.description }}</h3>
                <p class="trust">Persona · sin verificar · {{ n.createdAt | date: 'd MMM, HH:mm' }}</p>
                <button type="button" class="mini" (click)="focusNeed(n)">Ver en mapa</button>
              </article>
            </li>
          </ul>
          <ng-template #emptyAvisos>
            <div class="empty" *ngIf="!loading()">
              <strong>No hay avisos abiertos ahora.</strong>
              <p>Si ves una necesidad cerca, déjala como comentario en el mapa.</p>
              <a routerLink="/necesito-ayuda" class="cta inline">Dejar un aviso</a>
            </div>
          </ng-template>
        </div>

        <div class="panel" *ngIf="tab() === 'oficial'">
          <div class="panel-head">
            <div>
              <h2>Alertas oficiales y salud</h2>
              <p>
                IDEAM (ríos/niveles) y sedes IPS (SISPRO). Úsalo cuando quieras datos oficiales —
                no es el listado de “quién necesita apoyo”.
              </p>
            </div>
            <div class="toolbar tight">
              <button type="button" class="ghost" (click)="syncOfficial()" [disabled]="syncing()">
                {{ syncing() ? 'Actualizando…' : 'Actualizar alertas + salud aquí' }}
              </button>
            </div>
          </div>
          <label class="check">
            <input type="checkbox" [(ngModel)]="showHealth" (ngModelChange)="applyMapMarkers()" />
            Mostrar IPS de salud en el mapa (pueden ser muchos)
          </label>
          <ul class="cards compact">
            <li *ngFor="let e of alertas().slice(0, 40)">
              <article class="card alerta">
                <span class="badge">Alerta oficial</span>
                <h3>{{ eventPlainTitle(e.type, e.title) }}</h3>
                <p class="desc">{{ eventPlainDetail(e.summary) }}</p>
                <p class="trust">IDEAM · oficial</p>
                <button type="button" class="mini" (click)="focusEvent(e)">Ver en mapa</button>
              </article>
            </li>
          </ul>
          <p class="hint" *ngIf="!alertas().length && !loading()">
            Sin alertas cargadas. Pulsa “Actualizar alertas + salud aquí” con el mapa en la zona que
            te interesa.
          </p>
        </div>

        <details class="map-wrap" open>
          <summary>Mapa (Colombia)</summary>
          <div #mapHost class="map" role="img" aria-label="Mapa de Colombia"></div>
          <p class="attr">
            ©
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener"
              >OpenStreetMap</a
            >
            · Puntos comunitarios · Salud: SISPRO (capa opcional)
          </p>
        </details>
      </div>
    </section>
  `,
  styles: [
    `
      .page-hero {
        background: var(--ink);
        color: #f7f3ec;
        padding: 2rem 0 2.2rem;
      }
      .wrap {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.75rem;
        opacity: 0.75;
      }
      h1 {
        margin: 0.45rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 5vw, 2.55rem);
        letter-spacing: -0.03em;
        max-width: 18ch;
      }
      .lead {
        margin: 0.75rem 0 0;
        max-width: 42rem;
        font-weight: 600;
        opacity: 0.92;
        line-height: 1.45;
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.2rem;
      }
      .toolbar.tight {
        margin-top: 0;
      }
      .cta,
      .ghost,
      a.ghost {
        min-height: 46px;
        border-radius: 999px;
        font-weight: 800;
        padding: 0 1.05rem;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
        border: 0;
        font: inherit;
      }
      .cta {
        background: var(--coral);
        color: #fff;
      }
      .cta.inline {
        margin-top: 0.75rem;
        width: fit-content;
      }
      .ghost,
      a.ghost {
        background: transparent;
        color: #fff;
        border: 1.5px solid rgba(255, 255, 255, 0.35);
      }
      .body .ghost {
        color: var(--ink);
        border-color: var(--line);
        background: var(--white);
      }
      .body {
        background: var(--cream);
        padding: 1.25rem 0 3rem;
      }
      .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
      .tabs button {
        border: 1px solid var(--line);
        background: var(--white);
        border-radius: 999px;
        padding: 0.65rem 0.95rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.9rem;
      }
      .tabs button.on {
        background: var(--ink);
        color: #fff;
        border-color: transparent;
      }
      .count {
        font-size: 0.75rem;
        opacity: 0.85;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        padding: 0.1rem 0.45rem;
      }
      .tabs button.on .count {
        background: rgba(255, 255, 255, 0.18);
      }
      .panel {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 1.1rem 1.1rem 1.25rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
      }
      .panel-head {
        display: grid;
        gap: 0.85rem;
        margin-bottom: 1rem;
      }
      @media (min-width: 800px) {
        .panel-head {
          grid-template-columns: 1fr auto;
          align-items: start;
        }
      }
      .panel-head h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.35rem;
      }
      .panel-head p {
        margin: 0.35rem 0 0;
        color: var(--muted);
        font-weight: 600;
        max-width: 40rem;
      }
      .city {
        display: grid;
        gap: 0.35rem;
        font-weight: 800;
        font-size: 0.82rem;
        min-width: 220px;
      }
      .city select {
        min-height: 44px;
        border-radius: 12px;
        border: 1px solid var(--line);
        padding: 0.4rem 0.65rem;
        font: inherit;
        font-weight: 600;
      }
      .cards {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.7rem;
      }
      .cards.compact {
        max-height: 42vh;
        overflow: auto;
      }
      .card {
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 0.95rem 1rem;
        display: grid;
        gap: 0.35rem;
        background: var(--cream);
      }
      .card.punto {
        border-color: rgba(180, 120, 40, 0.35);
      }
      .card.aviso {
        border-color: rgba(228, 87, 76, 0.35);
      }
      .card.alerta {
        border-color: rgba(15, 110, 106, 0.35);
      }
      .badge {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--teal);
      }
      .card.aviso .badge {
        color: var(--coral);
      }
      .card.punto .badge {
        color: #9a6b1f;
      }
      .card h3 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.12rem;
        line-height: 1.25;
      }
      .desc,
      .meta,
      .trust,
      .hint {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.92rem;
      }
      .trust {
        font-size: 0.82rem;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 0.25rem;
      }
      .mini {
        min-height: 38px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: #fff;
        font-weight: 800;
        padding: 0 0.85rem;
        cursor: pointer;
        text-decoration: none;
        color: var(--ink);
        display: inline-flex;
        align-items: center;
        font: inherit;
        font-size: 0.85rem;
      }
      .mini.link {
        border-color: var(--teal);
        color: var(--teal-deep);
      }
      .empty {
        padding: 1.2rem 0.4rem 0.6rem;
        display: grid;
        gap: 0.45rem;
      }
      .empty strong {
        font-family: var(--font-display);
        font-size: 1.15rem;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        margin-bottom: 0.85rem;
        color: var(--ink-soft);
      }
      .toast {
        margin: 0 0 0.75rem;
        padding: 0.7rem 0.85rem;
        border-radius: 12px;
        background: var(--sky-band);
        font-weight: 700;
      }
      .toast.err {
        background: #f8d7d3;
        color: var(--coral-deep);
      }
      .map-wrap {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 0.65rem 0.75rem 0.85rem;
        box-shadow: var(--shadow);
      }
      .map-wrap summary {
        cursor: pointer;
        font-weight: 800;
        padding: 0.35rem 0.25rem 0.55rem;
      }
      .map {
        height: 48vh;
        min-height: 280px;
        border-radius: 14px;
        overflow: hidden;
        background: #d5e0e8;
      }
      .attr {
        margin: 0.4rem 0 0;
        font-size: 0.78rem;
        color: var(--muted);
        font-weight: 600;
      }
      .attr a {
        color: var(--teal);
      }
    `,
  ],
})
export class MapPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapHost') mapHost!: ElementRef<HTMLDivElement>;
  private readonly api = inject(ApiService);
  private map?: Map;
  private markers: Marker[] = [];
  private userMarker?: Marker;

  readonly tab = signal<MainTab>('apoyo');
  readonly loading = signal(false);
  readonly syncing = signal(false);
  readonly locating = signal(false);
  readonly status = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly cities = signal<CityDto[]>([]);
  readonly places = signal<PlaceDto[]>([]);
  readonly avisos = signal<NeedDto[]>([]);
  readonly alertas = signal<EventDto[]>([]);
  readonly health = signal<PlaceDto[]>([]);

  cityCode = '';
  showHealth = false;

  readonly placeTypeLabel = placeTypeLabel;
  readonly eventPlainTitle = eventPlainTitle;
  readonly eventPlainDetail = eventPlainDetail;

  ngAfterViewInit(): void {
    this.api.cities().subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => undefined,
    });
    setTimeout(() => {
      this.initMap();
      this.loadHumanLayers();
      this.locateMe(false);
    }, 0);
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.userMarker?.remove();
    this.map?.remove();
  }

  officialCount(): number {
    return this.alertas().length + (this.showHealth ? this.health().length : 0);
  }

  setTab(t: MainTab): void {
    this.tab.set(t);
    this.applyMapMarkers();
    if (t === 'oficial' && !this.alertas().length && !this.syncing()) {
      this.syncOfficial();
    }
  }

  needTitle(n: NeedDto): string {
    return NEED_CATS[n.category]?.title ?? n.category;
  }

  showAllColombia(): void {
    this.cityCode = '';
    this.map?.fitBounds(CO_BOUNDS, { padding: 40, duration: 700 });
    this.reloadPlaces();
    this.status.set('Vista nacional de Colombia.');
  }

  locateMe(forceZoom: boolean): void {
    if (!navigator.geolocation) {
      if (forceZoom) this.error.set('No se puede usar la ubicación en este navegador.');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.locating.set(false);
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const inColombia =
          lng >= CO_BOUNDS[0][0] &&
          lng <= CO_BOUNDS[1][0] &&
          lat >= CO_BOUNDS[0][1] &&
          lat <= CO_BOUNDS[1][1];
        if (!inColombia) {
          this.status.set(
            'Tu ubicación está fuera de Colombia. El producto hoy cubre Colombia; mostramos el país.',
          );
          this.showAllColombia();
          return;
        }
        this.map?.easeTo({
          center: [lng, lat],
          zoom: forceZoom ? 11.5 : Math.max(this.map.getZoom(), 10),
          duration: 800,
        });
        this.userMarker?.remove();
        if (this.map) {
          const el = document.createElement('div');
          el.style.width = '16px';
          el.style.height = '16px';
          el.style.borderRadius = '50%';
          el.style.background = '#0f6e6a';
          el.style.border = '3px solid #fff';
          this.userMarker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(this.map);
        }
        this.status.set('Centrado cerca de ti. Los lugares siguen filtrables por ciudad o país.');
      },
      () => {
        this.locating.set(false);
        if (forceZoom) this.error.set('No pudimos leer tu ubicación. Usa “Ver todo el país”.');
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  reloadPlaces(): void {
    this.loading.set(true);
    const params: { origin: 'community'; limit: number; cityCode?: string } = {
      origin: 'community',
      limit: 200,
    };
    if (this.cityCode) params.cityCode = this.cityCode;
    this.api.places(params).subscribe({
      next: (res) => {
        this.places.set(res.data);
        this.loading.set(false);
        this.applyMapMarkers();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No pudimos cargar lugares.');
      },
    });
  }

  private loadHumanLayers(): void {
    this.error.set(null);
    this.reloadPlaces();
    this.api.needs().subscribe({
      next: (res) => {
        this.avisos.set(res.data);
        this.applyMapMarkers();
      },
      error: () => this.error.set('No pudimos cargar avisos.'),
    });
  }

  syncOfficial(): void {
    if (!this.map) return;
    this.syncing.set(true);
    this.error.set(null);
    const b = this.map.getBounds();
    const bbox = {
      west: b.getWest(),
      south: b.getSouth(),
      east: b.getEast(),
      north: b.getNorth(),
    };
    let left = 2;
    const finish = () => {
      left -= 1;
      if (left > 0) return;
      this.syncing.set(false);
      this.loadOfficialLists(bbox);
    };
    this.api.runIdeam().subscribe({
      next: () => finish(),
      error: () => {
        this.error.set('IDEAM no respondió ahora.');
        finish();
      },
    });
    this.api.runSispro(bbox).subscribe({
      next: (r) => {
        this.status.set(
          r.skipped
            ? 'SISPRO ya sincronizaba; cargando lo guardado…'
            : `Salud: ${r.placesUpserted} IPS en esta vista de mapa.`,
        );
        finish();
      },
      error: () => {
        this.status.set('SISPRO no sincronizó; mostrando lo guardado si hay.');
        finish();
      },
    });
  }

  private loadOfficialLists(bbox: {
    west: number;
    south: number;
    east: number;
    north: number;
  }): void {
    this.api.events().subscribe({
      next: (res) => {
        this.alertas.set(res.data);
        this.applyMapMarkers();
      },
      error: () => undefined,
    });
    this.api.places({ type: 'MEDICAL', origin: 'official', limit: 300, ...bbox }).subscribe({
      next: (res) => {
        this.health.set(res.data);
        this.applyMapMarkers();
      },
      error: () => undefined,
    });
  }

  focusPlace(p: PlaceDto): void {
    const c = this.point(p.geometry);
    if (!c) return;
    this.map?.easeTo({ center: c, zoom: 13, duration: 650 });
  }

  focusNeed(n: NeedDto): void {
    const c = this.point(n.geometry);
    if (!c) return;
    this.map?.easeTo({ center: c, zoom: 13, duration: 650 });
  }

  focusEvent(e: EventDto): void {
    const c = this.point(e.geometry);
    if (!c) return;
    this.map?.easeTo({ center: c, zoom: 10, duration: 650 });
  }

  applyMapMarkers(): void {
    this.clearMarkers();
    if (!this.map) return;
    const items: NearItem[] = [];
    const tab = this.tab();

    if (tab === 'apoyo' || tab === 'avisos') {
      for (const p of this.places()) {
        const c = this.point(p.geometry);
        if (!c) continue;
        items.push({
          id: p.id,
          kind: 'punto',
          title: p.title,
          detail: p.description || placeTypeLabel(p.type),
          trust: 'Comunidad',
          lng: c[0],
          lat: c[1],
        });
      }
    }
    if (tab === 'avisos' || tab === 'apoyo') {
      for (const n of this.avisos()) {
        const c = this.point(n.geometry);
        if (!c) continue;
        items.push({
          id: n.id,
          kind: 'aviso',
          title: n.description,
          detail: NEED_CATS[n.category]?.title ?? 'Aviso',
          trust: 'Persona',
          lng: c[0],
          lat: c[1],
        });
      }
    }
    if (tab === 'oficial') {
      for (const e of this.alertas()) {
        const c = this.point(e.geometry);
        if (!c) continue;
        items.push({
          id: e.id,
          kind: 'alerta',
          title: eventPlainTitle(e.type, e.title),
          detail: eventPlainDetail(e.summary),
          trust: 'IDEAM',
          lng: c[0],
          lat: c[1],
        });
      }
      if (this.showHealth) {
        for (const p of this.health().slice(0, 150)) {
          const c = this.point(p.geometry);
          if (!c) continue;
          items.push({
            id: p.id,
            kind: 'salud',
            title: p.title,
            detail: p.municipality || 'IPS',
            trust: 'SISPRO',
            lng: c[0],
            lat: c[1],
          });
        }
      }
    }

    for (const item of items.slice(0, 200)) {
      const color =
        item.kind === 'punto'
          ? '#b47828'
          : item.kind === 'aviso'
            ? '#e4574c'
            : item.kind === 'alerta'
              ? '#0f6e6a'
              : '#1c64a0';
      const el = this.dot(color, item.kind !== 'aviso');
      this.markers.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([item.lng, item.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 12 }).setHTML(
              `<strong>${this.esc(item.title)}</strong><br/>${this.esc(item.detail)}`,
            ),
          )
          .addTo(this.map),
      );
    }
  }

  private initMap(): void {
    if (!this.mapHost?.nativeElement || this.map) return;
    this.map = new maplibregl.Map({
      container: this.mapHost.nativeElement,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      bounds: CO_BOUNDS,
      fitBoundsOptions: { padding: 28 },
    });
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    this.map.on('load', () => this.map?.resize());
  }

  private point(
    geometry:
      | Record<string, unknown>
      | { type: string; coordinates: [number, number] }
      | null
      | undefined,
  ): [number, number] | null {
    if (!geometry || geometry.type !== 'Point') return null;
    const c = geometry.coordinates as unknown;
    if (!Array.isArray(c) || c.length < 2) return null;
    const lng = Number(c[0]);
    const lat = Number(c[1]);
    if (Number.isNaN(lng) || Number.isNaN(lat)) return null;
    return [lng, lat];
  }

  private clearMarkers(): void {
    for (const m of this.markers) m.remove();
    this.markers = [];
  }

  private dot(color: string, round: boolean): HTMLDivElement {
    const el = document.createElement('div');
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = round ? '50%' : '4px';
    el.style.background = color;
    el.style.border = '3px solid #fff';
    return el;
  }

  private esc(v: string): string {
    return v
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
