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
import type { EventDto, NeedDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { NEED_CATS, eventPlainTitle } from '../plain-labels';

type NearItem = {
  id: string;
  kind: 'alerta' | 'pedido';
  title: string;
  detail: string;
  trust: string;
  lng: number;
  lat: number;
};

@Component({
  selector: 'aee-map-page',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <section class="page-hero">
      <div class="wrap">
        <p class="kicker">Acompañar</p>
        <h1>Comunidad</h1>
        <p class="lead">
          Lista + mapa: alertas oficiales y <strong>avisos</strong> de personas (comentarios en un
          lugar, sin verificar). No operamos donaciones: solo mostramos señales.
        </p>
        <div class="toolbar">
          <button type="button" class="ghost" (click)="locateMe()" [disabled]="locating()">
            {{ locating() ? 'Buscando…' : 'Mi ubicación' }}
          </button>
          <button type="button" class="cta" (click)="refreshAll()" [disabled]="loading() || syncing()">
            {{ loading() || syncing() ? 'Actualizando…' : 'Actualizar datos' }}
          </button>
        </div>
      </div>
    </section>

    <section class="body">
      <div class="wrap layout">
        <div>
          <p class="toast" *ngIf="status()">{{ status() }}</p>
          <p class="toast err" *ngIf="error()">{{ error() }}</p>

          <ul class="list" *ngIf="items().length; else empty">
            <li *ngFor="let item of items()">
              <button
                type="button"
                class="item"
                [class.alerta]="item.kind === 'alerta'"
                (click)="focus(item)"
              >
                <span class="tag">{{ item.kind === 'alerta' ? 'Oficial' : 'Aviso' }}</span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.detail }}</small>
                <em>{{ item.trust }}</em>
              </button>
            </li>
          </ul>
          <ng-template #empty>
            <p class="empty" *ngIf="!loading()">Aún no hay datos. Pulsa Actualizar.</p>
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
        max-width: 40rem;
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
      .tag {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--teal);
      }
      .item:not(.alerta) .tag {
        color: var(--coral);
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
  private pendingEvents: EventDto[] = [];
  private pendingNeeds: NeedDto[] = [];

  readonly loading = signal(false);
  readonly syncing = signal(false);
  readonly locating = signal(false);
  readonly status = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly items = signal<NearItem[]>([]);

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.userMarker?.remove();
    this.map?.remove();
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
      zoom: 5.4,
    });
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    this.refreshAll();
    this.map.on('load', () => {
      this.map?.resize();
      this.render(this.pendingEvents, this.pendingNeeds);
    });
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
        this.map?.easeTo({ center: [lng, lat], zoom: 11, duration: 800 });
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
        this.status.set('Mapa centrado en tu ubicación.');
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
    this.api.runIdeam().subscribe({
      next: () => {
        this.syncing.set(false);
        this.refresh();
      },
      error: () => {
        this.syncing.set(false);
        this.refresh();
        this.status.set('Mostramos lo ya guardado.');
      },
    });
  }

  refresh(): void {
    this.loading.set(true);
    let events: EventDto[] = [];
    let needs: NeedDto[] = [];
    let pending = 2;
    const done = () => {
      pending -= 1;
      if (pending > 0) return;
      this.loading.set(false);
      this.pendingEvents = events;
      this.pendingNeeds = needs;
      this.render(events, needs);
      this.status.set(
        `${events.filter((e) => this.point(e.geometry)).length} alertas · ${needs.filter((n) => this.point(n.geometry)).length} avisos`,
      );
    };
    this.api.events().subscribe({
      next: (res) => {
        events = res.data;
        done();
      },
      error: () => {
        this.error.set('No se pudieron cargar alertas.');
        done();
      },
    });
    this.api.needs().subscribe({
      next: (res) => {
        needs = res.data;
        done();
      },
      error: () => {
        this.error.set('No se pudieron cargar pedidos.');
        done();
      },
    });
  }

  focus(item: NearItem): void {
    this.map?.easeTo({ center: [item.lng, item.lat], zoom: 10, duration: 650 });
  }

  private render(events: EventDto[], needs: NeedDto[]): void {
    this.clearMarkers();
    const list: NearItem[] = [];
    for (const e of events) {
      const coords = this.point(e.geometry);
      if (!coords) continue;
      const title = eventPlainTitle(e.type, e.title);
      list.push({
        id: e.id,
        kind: 'alerta',
        title,
        detail: e.summary?.trim() || e.sourceName || 'Fuente oficial',
        trust: 'Información oficial',
        lng: coords[0],
        lat: coords[1],
      });
      if (this.map) {
        const el = this.dot('#0f6e6a', true);
        this.markers.push(
          new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(this.map),
        );
      }
    }
    for (const n of needs) {
      const coords = this.point(n.geometry);
      if (!coords) continue;
      const title = NEED_CATS[n.category]?.title ?? n.category;
      list.push({
        id: n.id,
        kind: 'pedido',
        title: `Aviso: ${title}`,
        detail: n.description,
        trust: 'Comentario de persona · sin verificar',
        lng: coords[0],
        lat: coords[1],
      });
      if (this.map) {
        const el = this.dot('#e4574c', false);
        this.markers.push(
          new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(this.map),
        );
      }
    }
    this.items.set(list.slice(0, 80));
    if (this.map && list.length > 1) {
      const bounds = new maplibregl.LngLatBounds(
        [list[0].lng, list[0].lat],
        [list[0].lng, list[0].lat],
      );
      for (const it of list) bounds.extend([it.lng, it.lat]);
      this.map.fitBounds(bounds, { padding: 40, maxZoom: 9, duration: 500 });
    }
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
}
