import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import type { SourceDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { statusLabel } from '../plain-labels';

@Component({
  selector: 'aee-home-page',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DatePipe],
  template: `
    <section class="hero" aria-label="Inicio">
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="hero-inner fade-up">
        <p class="brand">Ayuda en Emergencias</p>
        <h1>Encuentra ayuda. Ofrece ayuda. Sin rodeos.</h1>
        <p class="lead">
          Un lugar para publicar lo que necesitas, lo que puedes aportar, y ver dónde hay acopios u
          organizaciones. Nosotros no pedimos ni manejamos donaciones: solo conectamos.
        </p>
        <div class="actions">
          <a class="btn primary" routerLink="/buscar">¿Qué necesitas?</a>
          <a class="btn secondary" routerLink="/ayudar">Quiero ayudar</a>
        </div>
        <div class="sos-row">
          <a class="sos" href="tel:123">SOS · Llamar al 123</a>
          <button type="button" class="share-loc" (click)="shareLocation()">
            Compartir mi ubicación por WhatsApp
          </button>
        </div>
        <p class="sos-note">El 123 es la línea de urgencias. Nosotros no despachamos rescate.</p>
        <p class="geo-err" *ngIf="geoError()">{{ geoError() }}</p>
        <button type="button" class="install" *ngIf="installReady()" (click)="installApp()">
          Añadir a la pantalla de inicio
        </button>
      </div>
    </section>

    <section class="pulse" aria-label="Actividad en vivo">
      <div class="wrap wide">
        <p class="pulse-kicker">Ahora mismo en la plataforma</p>
        <div class="stats" *ngIf="loaded(); else loadingPulse">
          <div>
            <strong>{{ needs() }}</strong>
            <span>Avisos abiertos (necesito / puedo aportar)</span>
          </div>
          <div>
            <strong>{{ places() }}</strong>
            <span>Puntos para ayudar o pedir</span>
          </div>
          <div>
            <strong>{{ events() }}</strong>
            <span>Alertas oficiales en el mapa</span>
          </div>
          <div>
            <strong>{{ sourcesLive() }}</strong>
            <span>Fuentes de datos conectadas</span>
          </div>
        </div>
        <ng-template #loadingPulse>
          <p class="pulse-loading">Cargando actividad…</p>
        </ng-template>
        <p class="pulse-note">
          Cifras de lo publicado aquí. No es un reporte de la UNGRD. Los avisos de personas no están
          verificados.
        </p>
      </div>
    </section>

    <section class="section" id="que-es">
      <div class="wrap wide">
        <div class="intro">
          <div>
            <p class="kicker">Qué es esto</p>
            <h2>Para pedirlo o darlo, en un solo sitio.</h2>
          </div>
          <p class="body">
            Sirve para dos cosas: que una persona diga “necesito agua / un vehículo / manos” (o “tengo
            mercado / carro libre”), y que otra encuentre acopios u organizaciones por ciudad. La
            conversación, si hay WhatsApp, es entre ustedes.
          </p>
        </div>
        <div class="quick">
          <a routerLink="/buscar">Publicar o leer avisos</a>
          <a routerLink="/ayudar">Quiero ayudar</a>
          <a routerLink="/origenes">Orígenes</a>
          <a routerLink="/perdidos">Perdidos / encontrados</a>
          <a routerLink="/publicar-punto">Publicar un lugar</a>
          <a href="tel:123">Llamar al 123</a>
        </div>
      </div>
    </section>

    <section class="section soft" id="caminos">
      <div class="wrap wide">
        <p class="kicker teal">Empieza aquí</p>
        <h2>Elige cómo quieres ayudar o pedirlo.</h2>
        <div class="ways">
          <a class="way" routerLink="/buscar">
            <span class="way-label">Comunidad</span>
            <strong>¿Qué necesitas?</strong>
            <p>
              Muro de avisos: necesidades y aportes por categoría. Contacto directo por WhatsApp si
              la persona lo deja.
            </p>
            <span class="way-go">Abrir →</span>
          </a>
          <a class="way alt" routerLink="/ayudar">
            <span class="way-label">Quiero ayudar</span>
            <strong>Dónde y cómo ayudar</strong>
            <p>
              Acopios, albergues y centros. Filtra qué puedes llevar y abre el canal de la org — sin
              pasar por nosotros.
            </p>
            <span class="way-go">Ver lugares →</span>
          </a>
          <a class="way" routerLink="/perdidos">
            <span class="way-label">Comunidad</span>
            <strong>Perdidos y encontrados</strong>
            <p>
              Mascotas: publica una señal. Personas: canales oficiales (RND/SIRDEC) — sin registro
              paralelo nuestro.
            </p>
            <span class="way-go">Abrir →</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section" id="fuentes">
      <div class="wrap wide">
        <div class="intro">
          <div>
            <p class="kicker">Orígenes</p>
            <h2>De dónde sale la información.</h2>
          </div>
          <p class="body">
            En la fase de discovery conectamos APIs y catálogos públicos (salud, hidrología, mapas,
            directorios). Aquí ves cuáles están integrados o en prueba — sin inventar cifras.
          </p>
        </div>

        <ul class="sources" *ngIf="sources().length; else noSources">
          <li *ngFor="let s of sources()">
            <div>
              <strong>{{ s.name }}</strong>
              <p>{{ sourceBlurb(s) }}</p>
            </div>
            <span class="badge" [attr.data-status]="s.integrationStatus">{{
              statusLabel(s.integrationStatus)
            }}</span>
          </li>
        </ul>
        <ng-template #noSources>
          <p class="body">Aún no pudimos cargar el listado de fuentes.</p>
        </ng-template>

        <p class="source-meta" *ngIf="latestFetch()">
          Última actualización registrada:
          {{ latestFetch() | date: 'd MMM y, HH:mm' }}
        </p>
        <a class="more" routerLink="/origenes">Ver orígenes y canales →</a>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        position: relative;
        min-height: min(82vh, 700px);
        display: grid;
        align-items: end;
        color: #f7f3ec;
        background:
          #10233f
          url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1800&q=75')
          center 30% / cover no-repeat;
        padding: 0 0 2.8rem;
      }
      .hero-shade {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(16, 35, 63, 0.35) 0%,
          rgba(16, 35, 63, 0.55) 42%,
          rgba(16, 35, 63, 0.92) 100%
        );
        pointer-events: none;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
        padding-top: 5rem;
        max-width: 40rem;
      }
      .brand {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(1.35rem, 3.5vw, 1.75rem);
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      h1 {
        margin: 0.85rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 5.8vw, 3.05rem);
        line-height: 1.12;
        letter-spacing: -0.03em;
        font-weight: 700;
      }
      .lead {
        margin: 1.05rem 0 0;
        font-size: 1.08rem;
        font-weight: 500;
        line-height: 1.5;
        color: rgba(247, 243, 236, 0.9);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 1.6rem;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: var(--tap);
        padding: 0 1.3rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        font-size: 1rem;
      }
      .btn.primary {
        background: var(--coral);
        color: #fff;
      }
      .btn.secondary {
        border: 1.5px solid rgba(255, 255, 255, 0.45);
        color: #fff;
      }
      .sos-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 1.15rem;
        align-items: center;
      }
      .sos {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: var(--tap);
        padding: 0 1.15rem;
        border-radius: 999px;
        background: #fff;
        color: var(--coral-deep);
        font-weight: 800;
        font-size: 0.95rem;
        text-decoration: none;
      }
      .share-loc {
        border: 1.5px solid rgba(255, 255, 255, 0.45);
        background: transparent;
        color: #fff;
        border-radius: 999px;
        min-height: var(--tap);
        padding: 0 1rem;
        font-weight: 700;
        font-size: 0.88rem;
        cursor: pointer;
      }
      .sos-note,
      .geo-err {
        margin: 0.55rem 0 0;
        font-weight: 600;
        font-size: 0.82rem;
        color: rgba(247, 243, 236, 0.7);
        max-width: 36rem;
      }
      .geo-err {
        color: #ffb4ad;
      }
      .install {
        margin-top: 0.75rem;
        border: 0;
        border-radius: 999px;
        min-height: 2.5rem;
        padding: 0 1rem;
        background: var(--teal);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }
      .pulse {
        background: var(--ink);
        color: #f7f3ec;
        padding: 1.8rem 0 2rem;
      }
      .pulse-kicker {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        opacity: 0.7;
      }
      .stats {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      @media (min-width: 800px) {
        .stats {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      .stats div {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1rem 0.95rem;
      }
      .stats strong {
        display: block;
        font-family: var(--font-display);
        font-size: clamp(1.6rem, 4vw, 2.1rem);
        line-height: 1;
        color: #fff;
      }
      .stats span {
        display: block;
        margin-top: 0.45rem;
        font-size: 0.86rem;
        font-weight: 600;
        color: rgba(247, 243, 236, 0.7);
      }
      .pulse-note,
      .pulse-loading {
        margin: 1rem 0 0;
        font-weight: 600;
        color: rgba(247, 243, 236, 0.75);
        font-size: 0.95rem;
      }
      .section {
        padding: 3.2rem 0;
        background: var(--white);
      }
      .section.soft {
        background: var(--cream);
      }
      .wrap {
        width: min(720px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .wrap.wide {
        width: min(1120px, calc(100% - 1.5rem));
      }
      .kicker {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.78rem;
        color: var(--coral);
      }
      .kicker.teal {
        color: var(--teal);
      }
      h2 {
        margin: 0.55rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.65rem, 4vw, 2.35rem);
        line-height: 1.15;
        letter-spacing: -0.02em;
        font-weight: 700;
        max-width: 18ch;
        color: var(--ink);
      }
      .intro {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 860px) {
        .intro {
          grid-template-columns: 1fr 1.1fr;
          align-items: end;
          gap: 2rem;
        }
      }
      .body {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 500;
        color: var(--ink-soft);
        line-height: 1.55;
      }
      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 1.5rem;
      }
      .quick a {
        text-decoration: none;
        background: var(--cream);
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.65rem 1rem;
        font-weight: 700;
        color: var(--ink);
      }
      .ways {
        display: grid;
        gap: 0.9rem;
        margin-top: 1.6rem;
      }
      @media (min-width: 860px) {
        .ways {
          grid-template-columns: 1fr 1fr;
        }
      }
      .way {
        text-decoration: none;
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 1.4rem 1.3rem 1.25rem;
        display: grid;
        gap: 0.35rem;
        min-height: 200px;
        transition: transform 0.2s var(--ease);
        box-shadow: var(--shadow);
      }
      .way:hover {
        transform: translateY(-3px);
      }
      .way.alt {
        background: var(--ink);
        color: #f7f3ec;
        border-color: transparent;
      }
      .way-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--coral);
      }
      .way.alt .way-label {
        color: #ffb4ad;
      }
      .way strong {
        font-family: var(--font-display);
        font-size: 1.55rem;
        letter-spacing: -0.02em;
        font-weight: 700;
      }
      .way p {
        margin: 0;
        color: var(--muted);
        font-weight: 500;
        line-height: 1.45;
      }
      .way.alt p {
        color: rgba(247, 243, 236, 0.72);
      }
      .way-go {
        margin-top: auto;
        padding-top: 1rem;
        font-weight: 700;
        color: var(--teal);
      }
      .way.alt .way-go {
        color: #fff;
      }
      .sources {
        list-style: none;
        margin: 1.5rem 0 0;
        padding: 0;
        display: grid;
        gap: 0.65rem;
      }
      @media (min-width: 800px) {
        .sources {
          grid-template-columns: 1fr 1fr;
        }
      }
      .sources li {
        background: var(--cream);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem 1.05rem;
        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: flex-start;
      }
      .sources strong {
        font-family: var(--font-display);
        font-size: 1rem;
        display: block;
      }
      .sources p {
        margin: 0.35rem 0 0;
        color: var(--muted);
        font-weight: 500;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      .badge {
        flex: 0 0 auto;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.3rem 0.55rem;
        border-radius: 999px;
        background: var(--sky-band);
        color: var(--ink-soft);
        white-space: nowrap;
      }
      .badge[data-status='INTEGRATED'] {
        background: #d8f0ec;
        color: var(--teal-deep);
      }
      .badge[data-status='TESTING'] {
        background: #fff3cd;
        color: #7a5b00;
      }
      .badge[data-status='BLOCKED'] {
        background: #f8d7d3;
        color: var(--coral-deep);
      }
      .source-meta {
        margin: 1rem 0 0;
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--muted);
      }
      .more {
        display: inline-block;
        margin-top: 1rem;
        font-weight: 700;
        color: var(--teal);
        text-decoration: none;
      }
    `,
  ],
})
export class HomePageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly places = signal(0);
  readonly needs = signal(0);
  readonly events = signal(0);
  readonly sources = signal<SourceDto[]>([]);
  readonly loaded = signal(false);
  readonly statusLabel = statusLabel;
  readonly geoError = signal<string | null>(null);
  readonly installReady = signal(false);
  private deferredInstall: { prompt: () => Promise<void> } | null = null;

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredInstall = e as unknown as { prompt: () => Promise<void> };
      this.installReady.set(true);
    });
    let left = 4;
    const done = () => {
      left -= 1;
      if (left <= 0) this.loaded.set(true);
    };
    this.api.places({ helpOnly: true, origin: 'all', limit: 200 }).subscribe({
      next: (r) => {
        this.places.set(r.data.length);
        done();
      },
      error: () => done(),
    });
    this.api.needs().subscribe({
      next: (r) => {
        this.needs.set(r.data.length);
        done();
      },
      error: () => done(),
    });
    this.api.events().subscribe({
      next: (r) => {
        this.events.set(r.data.length);
        done();
      },
      error: () => done(),
    });
    this.api.sources().subscribe({
      next: (r) => {
        this.sources.set(
          r.data.filter((s) => s.id !== 'community').slice(0, 8),
        );
        done();
      },
      error: () => done(),
    });
  }

  shareLocation(): void {
    this.geoError.set(null);
    if (!navigator.geolocation) {
      this.geoError.set('Este navegador no comparte ubicación.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        const text = `Estoy aquí: https://maps.google.com/?q=${lat},${lng}\n(Ayuda en Emergencias — esto no llama al 123.)`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      },
      () => {
        this.geoError.set('No pudimos leer la ubicación. Revisa el permiso del navegador.');
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    );
  }

  async installApp(): Promise<void> {
    const ev = this.deferredInstall;
    if (!ev) return;
    await ev.prompt();
    this.installReady.set(false);
    this.deferredInstall = null;
  }

  sourcesLive(): number {
    return this.sources().filter(
      (s) => s.integrationStatus === 'INTEGRATED' || s.integrationStatus === 'TESTING',
    ).length;
  }

  latestFetch(): string | null {
    const dates = this.sources()
      .map((s) => s.lastSuccessfulFetch)
      .filter((d): d is string => Boolean(d))
      .sort()
      .reverse();
    return dates[0] ?? null;
  }

  sourceBlurb(s: SourceDto): string {
    if (s.id === 'ideam') return 'Alertas hidrológicas oficiales (niveles de ríos).';
    if (s.id === 'sispro') return 'Sedes de salud / IPS a escala país (MinSalud).';
    if (s.id === 'osm') return 'Puntos de ayuda comunitaria en mapa abierto.';
    if (s.id === 'curated') return 'Enlaces públicos a redes y organizaciones.';
    if (s.id === 'sgc') return 'Sismos: enlace al visor oficial cuando la API lo permita.';
    return s.type === 'OFFICIAL' ? 'Fuente oficial o institucional.' : 'Fuente abierta o de organización.';
  }
}
