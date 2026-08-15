import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { SourceDto } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { statusLabel } from '../plain-labels';

/** Canales oficiales / institucionales de Colombia (deep-link; no inventamos datos). */
type OfficialChannel = {
  group: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

const OFFICIAL_CHANNELS: OfficialChannel[] = [
  {
    group: 'Emergencia',
    title: 'Línea 123',
    body: 'Urgencia grave: socorro inmediato.',
    href: 'tel:123',
    cta: 'Llamar al 123',
  },
  {
    group: 'Riesgo nacional',
    title: 'UNGRD',
    body: 'Unidad Nacional para la Gestión del Riesgo de Desastres.',
    href: 'https://portal.gestiondelriesgo.gov.co/',
    cta: 'Abrir UNGRD',
  },
  {
    group: 'Riesgo nacional',
    title: 'Emergencias UNGRD (datos abiertos)',
    body: 'Histórico de emergencias en datos.gov.co (no es un contador en vivo).',
    href: 'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Emergencias-UNGRD-/wwkg-r6te',
    cta: 'Ver dataset',
  },
  {
    group: 'Clima e hidrología',
    title: 'IDEAM',
    body: 'Instituto de Hidrología, Meteorología y Estudios Ambientales.',
    href: 'https://www.ideam.gov.co/',
    cta: 'Abrir IDEAM',
  },
  {
    group: 'Sismos',
    title: 'Servicio Geológico Colombiano',
    body: 'Visor y reportes oficiales de sismos.',
    href: 'https://sgc.gov.co/sismos',
    cta: 'Ver sismos',
  },
  {
    group: 'Salud',
    title: 'Ministerio de Salud',
    body: 'Orientación nacional de salud pública.',
    href: 'https://www.minsalud.gov.co/',
    cta: 'Abrir MinSalud',
  },
  {
    group: 'Salud',
    title: 'SISPRO / REPS',
    body: 'Prestadores y sedes de salud (fuente de nuestros puntos MEDICAL).',
    href: 'https://www.sispro.gov.co/',
    cta: 'Abrir SISPRO',
  },
  {
    group: 'Salud',
    title: 'Instituto Nacional de Salud',
    body: 'Vigilancia en salud pública.',
    href: 'https://www.ins.gov.co/',
    cta: 'Abrir INS',
  },
  {
    group: 'Personas',
    title: 'Consulta de desaparecidos (SIRDEC)',
    body: 'Consulta pública de Medicina Legal / RND.',
    href: 'https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml',
    cta: 'Ir a la consulta',
  },
  {
    group: 'Personas',
    title: 'Registro Nacional de Desaparecidos',
    body: 'Información institucional del RND.',
    href: 'https://www.medicinalegal.gov.co/rnd-registro-de-desaparecidos',
    cta: 'Abrir portal RND',
  },
  {
    group: 'Personas',
    title: 'Línea 155 — violencia de género',
    body: 'Orientación nacional (cuando aplica en crisis).',
    href: 'tel:155',
    cta: 'Llamar al 155',
  },
  {
    group: 'Personas',
    title: 'ICBF — línea 141',
    body: 'Niñez y adolescencia en riesgo.',
    href: 'tel:141',
    cta: 'Llamar al 141',
  },
  {
    group: 'Socorro',
    title: 'Cruz Roja Colombiana',
    body: 'Socorro, voluntariado y sedes.',
    href: 'https://www.cruzrojacolombiana.org/',
    cta: 'Abrir Cruz Roja',
  },
  {
    group: 'Socorro',
    title: 'Defensa Civil Colombiana',
    body: 'Voluntariado y respuesta en emergencias.',
    href: 'https://www.defensacivil.gov.co/',
    cta: 'Abrir Defensa Civil',
  },
  {
    group: 'Socorro',
    title: 'Bomberos de Colombia (DNBC)',
    body: 'Orientación del cuerpo de bomberos.',
    href: 'https://dnbc.gov.co/',
    cta: 'Abrir DNBC',
  },
  {
    group: 'Alimentos',
    title: 'ABACO — Bancos de Alimentos',
    body: 'Red de bancos de alimentos en el país.',
    href: 'https://www.abaco.org.co/',
    cta: 'Abrir ABACO',
  },
  {
    group: 'Territorio',
    title: 'IDIGER — Bogotá',
    body: 'Gestión del riesgo en Bogotá.',
    href: 'https://www.idiger.gov.co/',
    cta: 'Abrir IDIGER',
  },
  {
    group: 'Territorio',
    title: 'DAGRD — Medellín',
    body: 'Gestión del riesgo de desastres Medellín.',
    href: 'https://www.medellin.gov.co/es/secretaria-de-gestion-y-control-territorial/dagrd/',
    cta: 'Abrir DAGRD',
  },
  {
    group: 'Territorio',
    title: 'Gestión del riesgo — Cali',
    body: 'Alcaldía de Cali / organismos de socorro.',
    href: 'https://www.cali.gov.co/',
    cta: 'Abrir Alcaldía Cali',
  },
  {
    group: 'Datos abiertos',
    title: 'datos.gov.co',
    body: 'Portal nacional de datos abiertos (incluye capas de emergencia).',
    href: 'https://www.datos.gov.co/',
    cta: 'Abrir datos.gov.co',
  },
  {
    group: 'Mapas',
    title: 'OpenStreetMap',
    body: 'Mapa base y puntos comunitarios (atribución ODbL).',
    href: 'https://www.openstreetmap.org/copyright',
    cta: 'Ver atribución OSM',
  },
];

@Component({
  selector: 'aee-sources-page',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Transparencia</p>
        <h1>Orígenes</h1>
        <p class="lead">
          Canales oficiales del país y el estado de lo que nosotros integramos. Un solo lugar para
          saber de dónde sale la información.
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap wide">
        <div class="guide">
          <div class="panel-card">
            <strong>Canales del país</strong>
            <p>Entidades y líneas a las que puedes ir directo.</p>
          </div>
          <div class="panel-card">
            <strong>Lo que integramos</strong>
            <p>Estado técnico de cada fuente en nuestra API (sync, pruebas, bloqueos).</p>
          </div>
        </div>

        <h2 class="sec">Canales oficiales</h2>
        <p class="sec-lead">
          Enlaces a sitios y líneas públicas. La acción ocurre allá; nosotros no operamos esos
          sistemas.
        </p>
        <ul class="channels">
          <li *ngFor="let c of channels">
            <article>
              <p class="g">{{ c.group }}</p>
              <h3>{{ c.title }}</h3>
              <p>{{ c.body }}</p>
              <a [href]="c.href" target="_blank" rel="noopener">{{ c.cta }}</a>
            </article>
          </li>
        </ul>

        <h2 class="sec">Lo que entra a nuestra plataforma</h2>
        <p class="sec-lead">
          Preferimos decir “aún no” antes que inventar una emergencia. También puedes
          <a routerLink="/publicar-punto">publicar un lugar</a> de la comunidad.
        </p>

        <p class="err" *ngIf="error()">{{ error() }}</p>

        <ul class="list" *ngIf="sources().length; else empty">
          <li *ngFor="let s of sources()">
            <div class="row">
              <h3>{{ friendlyName(s) }}</h3>
              <span class="badge">{{ statusLabel(s.integrationStatus) }}</span>
            </div>
            <p>{{ friendlyDesc(s) }}</p>
            <p class="meta" *ngIf="s.lastSuccessfulFetch">
              Última sync OK: {{ s.lastSuccessfulFetch | date: 'medium' }}
            </p>
            <p class="err-soft" *ngIf="s.lastError">Último error: {{ s.lastError }}</p>
            <a *ngIf="s.url" [href]="s.url" target="_blank" rel="noopener">Abrir sitio</a>
          </li>
        </ul>
        <ng-template #empty>
          <p *ngIf="!error()" class="muted">Cargando integraciones…</p>
        </ng-template>
      </div>
    </section>
  `,
  styles: [
    `
      .page-wrap.wide {
        width: min(1120px, calc(100% - 1.5rem));
      }
      .guide {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1.6rem;
      }
      @media (min-width: 700px) {
        .guide {
          grid-template-columns: 1fr 1fr;
        }
      }
      .guide .panel-card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem 1.1rem;
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
      .sec {
        margin: 0.5rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.35rem, 3vw, 1.75rem);
        letter-spacing: -0.02em;
      }
      .sec-lead {
        margin: 0.4rem 0 1rem;
        color: var(--muted);
        font-weight: 600;
        max-width: 42rem;
      }
      .sec-lead a {
        color: var(--teal);
        font-weight: 800;
      }
      .channels {
        list-style: none;
        margin: 0 0 2rem;
        padding: 0;
        display: grid;
        gap: 0.65rem;
      }
      @media (min-width: 800px) {
        .channels {
          grid-template-columns: 1fr 1fr;
        }
      }
      .channels article {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem 1.05rem;
        box-shadow: 0 8px 24px rgba(16, 35, 63, 0.04);
        display: grid;
        gap: 0.3rem;
        min-height: 100%;
      }
      .g {
        margin: 0;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--coral);
      }
      .channels h3,
      .list h3 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.08rem;
      }
      .channels p {
        margin: 0;
        color: var(--muted);
        font-weight: 500;
        font-size: 0.92rem;
        line-height: 1.4;
      }
      .channels a,
      .list a {
        display: inline-block;
        margin-top: 0.45rem;
        color: var(--teal);
        font-weight: 800;
        text-decoration: none;
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.7rem;
      }
      @media (min-width: 800px) {
        .list {
          grid-template-columns: 1fr 1fr;
        }
      }
      .list li {
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
      .badge {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.3rem 0.55rem;
        border-radius: 999px;
        background: var(--sky-band);
        color: var(--ink);
        white-space: nowrap;
      }
      .list p {
        margin: 0.45rem 0 0;
        color: var(--muted);
        font-weight: 600;
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
  readonly channels = OFFICIAL_CHANNELS;

  ngOnInit(): void {
    this.api.sources().subscribe({
      next: (res) => this.sources.set(res.data),
      error: () => this.error.set('No pudimos cargar las integraciones ahora.'),
    });
  }

  friendlyName(s: SourceDto): string {
    if (s.id === 'sispro') return 'SISPRO / REPS — salud (IPS)';
    if (s.id === 'community') return 'Comunidad (avisos y lugares)';
    if (s.id === 'ideam') return 'IDEAM — ríos y clima';
    if (s.id === 'sgc') return 'SGC — sismos';
    if (s.id === 'rnd') return 'RND / SIRDEC — desaparecidos';
    if (s.id === 'ungrd') return 'UNGRD — gestión del riesgo';
    if (s.id === 'idiger') return 'IDIGER — Bogotá';
    if (s.id === 'osm') return 'OpenStreetMap — puntos de ayuda';
    if (s.id === 'curated') return 'Directorio curado (enlaces)';
    return s.name;
  }

  friendlyDesc(s: SourceDto): string {
    if (s.id === 'sispro') return 'Sedes IPS que sincronizamos a la API.';
    if (s.id === 'community') return 'Lo que publica la gente en avisos y lugares.';
    if (s.id === 'ideam') return 'Alertas hidrológicas que entran por connector.';
    if (s.id === 'sgc') return 'Aún sin connector automático; canal arriba en esta página.';
    if (s.id === 'rnd') return 'Consulta oficial; no almacenamos fichas de personas.';
    if (s.id === 'ungrd') return 'Portal y datos abiertos (histórico).';
    if (s.id === 'idiger') return 'Gestión del riesgo Bogotá.';
    if (s.id === 'osm') return 'Amenities de ayuda vía Overpass (cobertura irregular).';
    if (s.id === 'curated') return 'Enlaces públicos a redes y organizaciones.';
    return 'Fuente registrada en el sistema.';
  }
}
