import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

type OfficialLink = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  warn?: string;
};

const LINKS: OfficialLink[] = [
  {
    id: 'rnd',
    kicker: 'Personas',
    title: 'Desaparecidos — RND / SIRDEC',
    body: 'Consulta pública de Medicina Legal. Nosotros no tenemos base de desaparecidos ni reemplazamos al registro oficial.',
    href: 'https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml',
    cta: 'Consultar en Medicina Legal',
    warn: 'Solo deep-link oficial. No publiques datos sensibles aquí.',
  },
  {
    id: 'rnd-portal',
    kicker: 'Personas',
    title: 'Portal RND (información)',
    body: 'Información institucional del Registro Nacional de Desaparecidos.',
    href: 'https://www.medicinalegal.gov.co/rnd-registro-de-desaparecidos',
    cta: 'Abrir portal RND',
  },
  {
    id: 'sgc',
    kicker: 'Sismos',
    title: 'Servicio Geológico Colombiano',
    body: 'Visor y reportes de sismos. Nuestro connector de sismos sigue bloqueado: usa siempre el canal oficial.',
    href: 'https://sgc.gov.co/sismos',
    cta: 'Ver sismos en SGC',
  },
  {
    id: 'ungrd',
    kicker: 'Gestión del riesgo',
    title: 'UNGRD',
    body: 'Unidad Nacional para la Gestión del Riesgo de Desastres. Orientación nacional y datos abiertos históricos.',
    href: 'https://portal.gestiondelriesgo.gov.co/',
    cta: 'Abrir UNGRD',
  },
  {
    id: 'ungrd-datos',
    kicker: 'Datos abiertos',
    title: 'Emergencias UNGRD (datos.gov.co)',
    body: 'Dataset histórico de emergencias. No es un feed en vivo de “cuántos afectados ahora”.',
    href: 'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Emergencias-UNGRD-/wwkg-r6te',
    cta: 'Ver dataset',
  },
  {
    id: 'idiger',
    kicker: 'Bogotá',
    title: 'IDIGER',
    body: 'Gestión del riesgo en Bogotá: datos abiertos y orientación distrital.',
    href: 'https://www.idiger.gov.co/',
    cta: 'Abrir IDIGER',
  },
  {
    id: 'cruz-roja',
    kicker: 'Socorro',
    title: 'Cruz Roja Colombiana',
    body: 'Orientación, voluntariado y sedes. La ayuda material o económica ocurre en sus canales.',
    href: 'https://www.cruzrojacolombiana.org/',
    cta: 'Abrir Cruz Roja',
  },
  {
    id: '123',
    kicker: 'Urgencia',
    title: 'Línea 123',
    body: 'Emergencia grave: llama a la línea de emergencias. Nosotros no somos el 123.',
    href: 'tel:123',
    cta: 'Llamar al 123',
  },
];

@Component({
  selector: 'aee-oficiales-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Canales oficiales</p>
        <h1>Ve a la fuente correcta</h1>
        <p class="lead">
          Sismos, desaparecidos y gestión del riesgo se consultan en entidades oficiales. Aquí solo
          <strong>enlazamos</strong>: no inventamos cifras ni operamos esos registros.
        </p>
        <a class="ghost" routerLink="/fuentes-detalle">Ver estado de nuestras integraciones</a>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap wide">
        <p class="banner">
          Personas desaparecidas: usa Medicina Legal / RND. No creamos fichas propias de personas
          perdidas — sería inseguro e incorrecto legalmente.
        </p>
        <ul class="grid">
          <li *ngFor="let L of links">
            <article class="card">
              <p class="ck">{{ L.kicker }}</p>
              <h2>{{ L.title }}</h2>
              <p>{{ L.body }}</p>
              <p class="warn" *ngIf="L.warn">{{ L.warn }}</p>
              <a class="btn" [href]="L.href" target="_blank" rel="noopener">{{ L.cta }}</a>
            </article>
          </li>
        </ul>
        <p class="note">
          Mascotas perdidas/encontradas serán un flujo propio de la plataforma (próxima fase
          prioritaria), distinto de personas.
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .page-wrap.wide {
        width: min(1120px, calc(100% - 1.5rem));
      }
      .ghost {
        display: inline-flex;
        margin-top: 1rem;
        color: rgba(247, 243, 236, 0.9);
        font-weight: 700;
      }
      .banner {
        margin: 0 0 1.2rem;
        padding: 0.95rem 1.1rem;
        border-radius: 14px;
        background: #f8d7d3;
        color: var(--coral-deep, #8b2e26);
        font-weight: 700;
        line-height: 1.4;
      }
      .grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.85rem;
      }
      @media (min-width: 800px) {
        .grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 1.15rem 1.2rem 1.2rem;
        box-shadow: var(--shadow);
        display: grid;
        gap: 0.45rem;
        min-height: 100%;
      }
      .ck {
        margin: 0;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--coral);
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.25rem;
        letter-spacing: -0.02em;
      }
      .card p {
        margin: 0;
        color: var(--muted);
        font-weight: 500;
        line-height: 1.45;
      }
      .warn {
        color: var(--coral-deep, #8b2e26) !important;
        font-weight: 700 !important;
        font-size: 0.9rem;
      }
      .btn {
        justify-self: start;
        margin-top: 0.35rem;
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 1rem;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        text-decoration: none;
      }
      .note {
        margin: 1.4rem 0 0;
        font-weight: 600;
        color: var(--muted);
        font-size: 0.95rem;
      }
    `,
  ],
})
export class OficialesPageComponent {
  readonly links = LINKS;
}
