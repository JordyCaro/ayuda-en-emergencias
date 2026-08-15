import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import type { CityDto, EventDto, NeedDto, PlaceDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { NEED_CATS, eventPlainTitle } from '../plain-labels';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LayerFilter = 'all' | 'alerta' | 'aviso' | 'salud' | 'punto';

type NearItem = {
  id: string;
  kind: 'alerta' | 'aviso' | 'salud' | 'punto';
  title: string;
  detail: string;
  trust: string;
  lng: number;
  lat: number;
  cityCode?: string | null;
};

@Component({
  selector: 'aee-map-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  template: `
    <section class="page-hero">
      <div class="wrap">
        <p class="kicker">Acompañar · Fase 3</p>
        <h1>Comunidad</h1>
        <p class="lead">
          Alertas (IDEAM), avisos, salud (SISPRO) y <strong>puntos</strong> de acopio/ONG
          publicados por la comunidad. No operamos donaciones.
        </p>
        <div class="toolbar">
          <a class="cta linkish" routerLink="/publicar-punto">Publicar punto</a>
          <button type="button" class="ghost" (click)="locateMe()" [disabled]="locating()">
            {{ locating() ? 'Buscando…' : 'Mi ubicación' }}
          </button>
          <button type="button" class="cta" (click)="refreshAll()" [disabled]="loading() || syncing()">
            {{ loading() || syncing() ? 'Actualizando…' : 'Actualizar zona' }}
          </button>
        </div>
      </div>
    </section>

    <section class="body">
      <div class="wrap layout">
        <div>
          <div class="filters" role="group" aria-label="Filtros">
            <button type="button" [class.on]="filter() === 'all'" (click)="setFilter('all')">Todo</button>
            <button type="button" [class.on]="filter() === 'alerta'" (click)="setFilter('alerta')">
              Alertas
            </button>
            <button type="button" [class.on]="filter() === 'aviso'" (click)="setFilter('aviso')">
              Avisos
            </button>
            <button type="button" [class.on]="filter() === 'salud'" (click)="setFilter('salud')">
              Salud
            </button>
            <button type="button" [class.on]="filter() === 'punto'" (click)="setFilter('punto')">
              Puntos
            </button>
          </div>

          <label class="city-filter" *ngIf="filter() === 'punto' || filter() === 'all'">
            Ciudad (puntos)
            <select [(ngModel)]="cityCode" (ngModelChange)="onCityChange()">
              <option value="">Todas (zona del mapa)</option>
              <option *ngFor="let c of cities()" [value]="c.code">
                {{ c.name }} — {{ c.department }}
              </option>
            </select>
          </label>

          <p class="toast" *ngIf="status()">{{ status() }}</p>
          <p class="toast err" *ngIf="error()">{{ error() }}</p>

          <ul class="list" *ngIf="visibleItems().length; else empty">
            <li *ngFor="let item of visibleItems()">
              <button
                type="button"
                class="item"
                [class.alerta]="item.kind === 'alerta'"
                [class.salud]="item.kind === 'salud'"
                [class.punto]="item.kind === 'punto'"
                (click)="focus(item)"
              >
                <span class="tag">{{ tagLabel(item.kind) }}</span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.detail }}</small>
                <em>{{ item.trust }}</em>
              </button>
            </li>
          </ul>
          <ng-template #empty>
            <p class="empty" *ngIf="!loading()">
              Nada en este filtro.
              <a routerLink="/publicar-punto">Publica un punto</a>
              o pulsa <strong>Actualizar zona</strong>.
            </p>
          </ng-template>
        </div>

        <details class="map-wrap" open>
          <summary>Mapa</summary>
          <div #mapHost class="map" role="img" aria-label="Mapa"></div>
          <p class="attr">
            ©
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener"
              >OpenStreetMap</a
            >
            · Salud: SISPRO / MinSalud · Puntos: comunidad
          </p>
        </details>
      </div>
    </section>
  `,
  styles: [
    `
      .page-hero {
        background: var(--teal);
        color: #f3fffc;
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
        font-size: 0.78rem;
        opacity: 0.85;
      }
      h1 {
        margin: 0.4rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.9rem, 6vw, 2.8rem);
        letter-spacing: -0.03em;
      }
      .lead {
        margin: 0.7rem 0 0;
        max-width: 42rem;
        font-weight: 600;
        opacity: 0.92;
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 1.2rem;
      }
      .cta,
      .ghost {
        min-height: 48px;
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
        padding: 0 1.15rem;
      }
      a.cta.linkish {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        border: 0;
        background: #fff;
        color: var(--teal-deep);
      }
      .city-filter {
        display: grid;
        gap: 0.35rem;
        margin: 0 0 0.75rem;
        font-weight: 800;
        font-size: 0.82rem;
      }
      .city-filter select {
        min-height: 44px;
        border-radius: 12px;
        border: 1px solid var(--line);
        padding: 0.45rem 0.7rem;
        font: inherit;
        font-weight: 600;
        background: var(--white);
      }
      .cta {
        border: 0;
        background: #fff;
        color: var(--teal-deep);
      }
      .ghost {
        border: 1.5px solid rgba(255, 255, 255, 0.4);
        background: transparent;
        color: #fff;
      }
      .cta:disabled,
      .ghost:disabled {
        opacity: 0.55;
      }
      .body {
        background: var(--cream);
        padding: 1.4rem 0 3rem;
      }
      .layout {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 900px) {
        .layout {
          grid-template-columns: 1fr 1.05fr;
          align-items: start;
        }
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
      }
      .filters button {
        border: 1px solid var(--line);
        background: var(--white);
        border-radius: 999px;
        padding: 0.5rem 0.85rem;
        font-weight: 800;
        cursor: pointer;
        font-size: 0.85rem;
      }
      .filters button.on {
        background: var(--ink);
        color: #fff;
        border-color: transparent;
      }
      .toast {
        margin: 0 0 0.75rem;
        padding: 0.75rem 0.9rem;
        border-radius: 12px;
        background: var(--sky-band);
        font-weight: 700;
      }
      .toast.err {
        background: #f8d7d3;
        color: var(--coral-deep);
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.55rem;
        max-height: 58vh;
        overflow: auto;
      }
      .item {
        width: 100%;
        text-align: left;
        border: 1px solid var(--line);
        background: var(--white);
        border-radius: 16px;
        padding: 0.9rem;
        cursor: pointer;
        display: grid;
        gap: 0.15rem;
      }
      .item.alerta {
        border-color: rgba(15, 110, 106, 0.35);
      }
      .item.salud {
        border-color: rgba(28, 100, 160, 0.4);
      }
      .item.punto {
        border-color: rgba(180, 120, 40, 0.45);
      }
      .tag {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--teal);
      }
      .item:not(.alerta):not(.salud):not(.punto) .tag {
        color: var(--coral);
      }
      .item.salud .tag {
        color: #1c64a0;
      }
      .item.punto .tag {
        color: #9a6b1f;
      }
      .item strong {
        font-family: var(--font-display);
        font-size: 1.05rem;
      }
      .item small,
      .item em {
        font-style: normal;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.9rem;
      }
      .empty {
        color: var(--muted);
        font-weight: 600;
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
        color: var(--ink);
      }
      .map {
        height: 42vh;
        min-height: 240px;
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
  private allItems: NearItem[] = [];

  readonly loading = signal(false);
  readonly syncing = signal(false);
  readonly locating = signal(false);
  readonly status = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly filter = signal<LayerFilter>('all');
  readonly visibleItems = signal<NearItem[]>([]);
  readonly cities = signal<CityDto[]>([]);
  cityCode = '';

  ngAfterViewInit(): void {
    this.api.cities().subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => undefined,
    });
    setTimeout(() => this.initMap(), 0);
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.userMarker?.remove();
    this.map?.remove();
  }

  setFilter(f: LayerFilter): void {
    this.filter.set(f);
    this.applyFilter();
  }

  onCityChange(): void {
    this.loadLists(this.currentBBox());
  }

  tagLabel(kind: NearItem['kind']): string {
    if (kind === 'alerta') return 'Alerta';
    if (kind === 'salud') return 'Salud';
    if (kind === 'punto') return 'Punto';
    return 'Aviso';
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
      center: [-74.072, 4.711],
      zoom: 10.2,
    });
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    this.map.on('load', () => {
      this.map?.resize();
      this.refreshAll();
    });
    this.map.on('moveend', () => {
      // no auto-fetch on every pan (costoso); el usuario pulsa Actualizar
    });
  }

  private currentBBox(): { west: number; south: number; east: number; north: number } {
    if (!this.map) {
      return { west: -74.25, south: 4.45, east: -73.95, north: 4.85 };
    }
    const b = this.map.getBounds();
    return {
      west: b.getWest(),
      south: b.getSouth(),
      east: b.getEast(),
      north: b.getNorth(),
    };
  }

  locateMe(): void {
    if (!navigator.geolocation) {
      this.error.set('No se puede usar la ubicación aquí.');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.locating.set(false);
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        this.map?.easeTo({ center: [lng, lat], zoom: 12, duration: 800 });
        this.userMarker?.remove();
        const el = document.createElement('div');
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.background = '#0f6e6a';
        el.style.border = '3px solid #fff';
        if (this.map) {
          this.userMarker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(this.map);
        }
        this.status.set('Centrado. Pulsa Actualizar zona para traer salud e IDEAM.');
      },
      () => {
        this.locating.set(false);
        this.error.set('No pudimos leer tu ubicación.');
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  refreshAll(): void {
    this.syncing.set(true);
    this.error.set(null);
    const bbox = this.currentBBox();
    let pending = 2;
    const errs: string[] = [];
    const doneSync = () => {
      pending -= 1;
      if (pending > 0) return;
      this.syncing.set(false);
      if (errs.length) this.error.set(errs.join(' · '));
      this.loadLists(bbox);
    };
    this.api.runIdeam().subscribe({
      next: () => doneSync(),
      error: (err) => {
        errs.push(this.httpMsg(err, 'IDEAM no respondió'));
        doneSync();
      },
    });
    this.api.runSispro(bbox).subscribe({
      next: (r) => {
        if (r.skipped) {
          this.status.set('SISPRO ya estaba sincronizando; mostrando datos guardados…');
        } else {
          const trunc = r.truncated ? ' (zona densa: muestra parcial)' : '';
          this.status.set(`Salud: ${r.placesUpserted} puntos en la zona${trunc} · trayendo listas…`);
        }
        doneSync();
      },
      error: (err) => {
        errs.push(this.httpMsg(err, 'No se pudo sync SISPRO'));
        this.status.set('Mostrando salud ya guardada en la zona.');
        doneSync();
      },
    });
  }

  private loadLists(bbox: {
    west: number;
    south: number;
    east: number;
    north: number;
  }): void {
    this.loading.set(true);
    let events: EventDto[] = [];
    let needs: NeedDto[] = [];
    let medical: PlaceDto[] = [];
    let community: PlaceDto[] = [];
    let pending = 4;
    const loadErrs: string[] = [];
    const done = () => {
      pending -= 1;
      if (pending > 0) return;
      this.loading.set(false);
      this.buildItems(events, needs, medical, community);
      this.status.set(
        `${events.length} alertas · ${needs.length} avisos · ${medical.length} salud · ${community.length} puntos`,
      );
      if (loadErrs.length && !this.error()) {
        this.error.set(loadErrs.join(' · '));
      }
    };
    this.api.events().subscribe({
      next: (res) => {
        events = res.data;
        done();
      },
      error: () => {
        loadErrs.push('No cargaron alertas');
        done();
      },
    });
    this.api.needs().subscribe({
      next: (res) => {
        needs = res.data;
        done();
      },
      error: () => {
        loadErrs.push('No cargaron avisos');
        done();
      },
    });
    this.api.places({ type: 'MEDICAL', origin: 'official', limit: 400, ...bbox }).subscribe({
      next: (res) => {
        medical = res.data;
        done();
      },
      error: () => {
        loadErrs.push('No cargaron puntos de salud');
        done();
      },
    });
    const communityParams: {
      origin: 'community';
      limit: number;
      cityCode?: string;
      west?: number;
      south?: number;
      east?: number;
      north?: number;
    } = { origin: 'community', limit: 400 };
    if (this.cityCode) {
      communityParams.cityCode = this.cityCode;
    } else {
      communityParams.west = bbox.west;
      communityParams.south = bbox.south;
      communityParams.east = bbox.east;
      communityParams.north = bbox.north;
    }
    this.api.places(communityParams).subscribe({
      next: (res) => {
        community = res.data;
        done();
      },
      error: () => {
        loadErrs.push('No cargaron puntos comunitarios');
        done();
      },
    });
  }

  private httpMsg(err: unknown, fallback: string): string {
    const e = err as { error?: { message?: string | string[] }; message?: string };
    const m = e?.error?.message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m) && m[0]) return String(m[0]);
    return fallback;
  }

  private buildItems(
    events: EventDto[],
    needs: NeedDto[],
    medical: PlaceDto[],
    community: PlaceDto[],
  ): void {
    const list: NearItem[] = [];
    for (const e of events) {
      const coords = this.point(e.geometry);
      if (!coords) continue;
      list.push({
        id: e.id,
        kind: 'alerta',
        title: eventPlainTitle(e.type, e.title),
        detail: e.summary?.trim() || e.sourceName || 'Fuente oficial',
        trust: 'Información oficial',
        lng: coords[0],
        lat: coords[1],
      });
    }
    for (const n of needs) {
      const coords = this.point(n.geometry);
      if (!coords) continue;
      const title = NEED_CATS[n.category]?.title ?? n.category;
      list.push({
        id: n.id,
        kind: 'aviso',
        title: `Aviso: ${title}`,
        detail: n.description,
        trust: 'Comentario de persona · sin verificar',
        lng: coords[0],
        lat: coords[1],
      });
    }
    for (const p of medical) {
      const coords = this.point(p.geometry);
      if (!coords) continue;
      list.push({
        id: p.id,
        kind: 'salud',
        title: p.title,
        detail: [p.address, p.municipality].filter(Boolean).join(' · ') || 'Sede IPS',
        trust: `${p.sourceName ?? 'SISPRO'} · oficial`,
        lng: coords[0],
        lat: coords[1],
      });
    }
    for (const p of community) {
      const coords = this.point(p.geometry);
      if (!coords) continue;
      const when = p.updatedAt ? ` · act. ${p.updatedAt.slice(0, 10)}` : '';
      list.push({
        id: p.id,
        kind: 'punto',
        title: p.title,
        detail:
          [p.description, p.municipality, p.externalUrl ? 'tiene enlace' : null]
            .filter(Boolean)
            .join(' · ') || 'Punto comunitario',
        trust: `Comunidad · sin verificar${when}`,
        lng: coords[0],
        lat: coords[1],
        cityCode: p.cityCode,
      });
    }
    this.allItems = list;
    this.applyFilter();
  }

  private applyFilter(): void {
    const f = this.filter();
    const filtered =
      f === 'all' ? this.allItems : this.allItems.filter((i) => i.kind === f);
    this.visibleItems.set(filtered.slice(0, 120));
    this.renderMarkers(filtered);
  }

  private renderMarkers(items: NearItem[]): void {
    this.clearMarkers();
    if (!this.map) return;
    for (const item of items.slice(0, 200)) {
      const color =
        item.kind === 'alerta'
          ? '#0f6e6a'
          : item.kind === 'salud'
            ? '#1c64a0'
            : item.kind === 'punto'
              ? '#b47828'
              : '#e4574c';
      const round = item.kind !== 'aviso';
      const el = this.dot(color, round);
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

  focus(item: NearItem): void {
    this.map?.easeTo({ center: [item.lng, item.lat], zoom: 13, duration: 650 });
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

  private esc(v: string): string {
    return v
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
