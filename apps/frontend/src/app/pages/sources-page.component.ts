import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import type { SourceDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { statusLabel } from '../plain-labels';

@Component({
  selector: 'aee-sources-page',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Transparencia</p>
        <h1>Fuentes</h1>
        <p class="lead">
          De dónde sale cada dato del directorio y las alertas. Preferimos decir “aún no” antes que
          inventar una emergencia.
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap">
        <div class="guide">
          <div class="panel-card">
            <strong>Oficial</strong>
            <p>Alertas y catálogos de entidades (IDEAM, salud, etc.).</p>
          </div>
          <div class="panel-card">
            <strong>Persona / org</strong>
            <p>Lugares y avisos del foro. Son señales; no los verificamos en la ficha.</p>
          </div>
        </div>

        <p class="err" *ngIf="error()">{{ error() }}</p>

        <ul class="list" *ngIf="sources().length; else empty">
          <li *ngFor="let s of sources()">
            <div class="row">
              <h2>{{ friendlyName(s) }}</h2>
              <span class="badge">{{ statusLabel(s.integrationStatus) }}</span>
            </div>
            <p>{{ friendlyDesc(s) }}</p>
            <p class="meta" *ngIf="s.lastSuccessfulFetch">
              Última sync OK: {{ s.lastSuccessfulFetch | date: 'medium' }}
            </p>
            <p class="err-soft" *ngIf="s.lastError">Último error: {{ s.lastError }}</p>
            <a *ngIf="s.url" [href]="s.url" target="_blank" rel="noopener">Abrir sitio oficial</a>
          </li>
        </ul>
        <ng-template #empty>
          <p *ngIf="!error()" class="muted">Cargando…</p>
        </ng-template>
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
        width: min(800px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.78rem;
        opacity: 0.75;
      }
      h1 {
        margin: 0.4rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.9rem, 6vw, 2.8rem);
        letter-spacing: -0.03em;
      }
      .lead {
        margin: 0.7rem 0 0;
        font-weight: 600;
        opacity: 0.85;
        max-width: 36rem;
      }
      .band {
        background: var(--cream);
        padding: 1.5rem 0 3rem;
      }
      .guide {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1.2rem;
      }
      @media (min-width: 700px) {
        .guide {
          grid-template-columns: 1fr 1fr;
        }
      }
      .guide div {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem;
      }
      .guide strong {
        font-family: var(--font-display);
        font-size: 1.1rem;
      }
      .guide p {
        margin: 0.35rem 0 0;
        color: var(--muted);
        font-weight: 600;
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.7rem;
      }
      li {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.05rem;
        box-shadow: 0 8px 24px rgba(16, 35, 63, 0.05);
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: flex-start;
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.15rem;
      }
      .badge {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.3rem 0.55rem;
        border-radius: 999px;
        background: var(--sky-band);
        color: var(--ink);
        white-space: nowrap;
      }
      p {
        margin: 0.45rem 0 0;
        color: var(--muted);
        font-weight: 600;
      }
      a {
        display: inline-block;
        margin-top: 0.7rem;
        color: var(--teal);
        font-weight: 800;
      }
      .meta {
        margin: 0.35rem 0 0;
        font-size: 0.85rem;
        color: var(--teal-deep);
        font-weight: 700;
      }
      .err-soft {
        margin: 0.35rem 0 0;
        font-size: 0.85rem;
        color: var(--coral-deep);
        font-weight: 700;
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
      }
      .muted {
        color: var(--muted);
        font-weight: 600;
      }
    `,
  ],
})
export class SourcesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly sources = signal<SourceDto[]>([]);
  readonly error = signal<string | null>(null);
  readonly statusLabel = statusLabel;

  ngOnInit(): void {
    this.api.sources().subscribe({
      next: (res) => this.sources.set(res.data),
      error: () => this.error.set('No pudimos cargar las fuentes ahora.'),
    });
  }

  friendlyName(s: SourceDto): string {
    if (s.id === 'sispro') return 'SISPRO / REPS — salud (IPS)';
    if (s.id === 'community') return 'Comunidad (avisos y lugares)';
    if (s.id === 'ideam') return 'IDEAM — ríos y clima';
    if (s.id === 'sgc') return 'SGC — sismos';
    if (s.id === 'osm') return 'OpenStreetMap — mapa base';
    return s.name;
  }

  friendlyDesc(s: SourceDto): string {
    if (s.id === 'sispro') {
      return 'Sedes IPS en el mapa (filtro Salud). Datos MinSalud / SISPRO.';
    }
    if (s.id === 'community') {
      return 'Avisos y puntos publicados por personas (sin verificar).';
    }
    if (s.id === 'ideam') return 'Alertas oficiales que ves en Comunidad.';
    if (s.id === 'sgc') return 'Todavía no entra automático; usa el enlace oficial.';
    if (s.id === 'osm') return 'Dibuja las calles del mapa. No es una alerta.';
    return 'Fuente registrada en el sistema.';
  }
}
