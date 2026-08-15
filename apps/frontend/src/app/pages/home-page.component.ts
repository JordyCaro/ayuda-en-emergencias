import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'aee-home-page',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy fade-up">
          <p class="eyebrow">Colombia · capa que conecta</p>
          <h1>
            ¿Dónde ayudar
            <span>en Colombia?</span>
            Sin intermediarnos en donaciones.
          </h1>
          <p class="lead">
            Encuentra <strong>lugares y organizaciones</strong> que piden apoyo, filtra por ciudad y
            categoría. Nosotros <strong>no pedimos ni manejamos donaciones</strong>: solo conectamos
            información. Si hay enlace, donas o ayudas en su canal.
          </p>
          <div class="hero-actions">
            <a class="btn coral" routerLink="/buscar">¿Qué necesitas?</a>
            <a class="btn ghost" routerLink="/ayudar">Ver lugares</a>
            <a class="btn ghost" routerLink="/publicar-punto">Publicar un lugar</a>
          </div>
          <a class="sos" href="tel:123">Si es grave ahora mismo → llama al 123</a>
        </div>

        <aside class="hero-panel fade-up" aria-label="Resumen en vivo">
          <div class="panel-head">Ahora mismo</div>
          <div class="stats" *ngIf="loaded(); else loadingStats">
            <div>
              <strong>{{ places() }}</strong>
              <span>Lugares publicados</span>
            </div>
            <div>
              <strong>{{ needs() }}</strong>
              <span>Avisos abiertos</span>
            </div>
          </div>
          <ng-template #loadingStats>
            <p class="loading">Cargando actividad…</p>
          </ng-template>
          <p class="panel-note">Directorio nacional · sin verificar hasta moderación.</p>
          <div class="geo" aria-hidden="true">
            <span class="bar"></span>
            <span class="bar short"></span>
            <span class="bar mid"></span>
          </div>
        </aside>
      </div>
    </section>

    <section class="band teal" id="que-es">
      <div class="wrap">
        <p class="band-kicker">Qué es esto</p>
        <h2>Una web que conecta — no un mostrador de donaciones.</h2>
        <div class="split">
          <p>
            Mostramos alertas oficiales (cuando hay fuente viable) y avisos de la comunidad en un
            mapa. Más adelante enlazaremos centros de acopio, fundaciones y ONG
            <strong>de terceros</strong>.
          </p>
          <p>
            <strong>No recaudamos dinero ni especie.</strong> No prometemos que un aviso será
            atendido. Si quieres donar, será en los canales de esas organizaciones — no a través
            nuestro.
          </p>
        </div>
      </div>
    </section>

    <section class="band cream" id="como">
      <div class="wrap">
        <p class="section-kicker">Cómo usarla</p>
        <h2 class="dark">Tres pasos. Sin cuentas.</h2>
        <ol class="steps">
          <li>
            <span class="num">01</span>
            <div>
              <h3>Elige qué quieres hacer</h3>
              <p>Dejar un aviso, mirar la comunidad o leer de dónde salen los datos.</p>
            </div>
          </li>
          <li>
            <span class="num">02</span>
            <div>
              <h3>Escribe un comentario en el mapa</h3>
              <p>
                Texto libre + lugar. Ejemplo: “Aquí hacen falta agua y manos para escombros”.
                Opcional: una etiqueta (agua, comida…).
              </p>
            </div>
          </li>
          <li>
            <span class="num">03</span>
            <div>
              <h3>Mira Comunidad</h3>
              <p>Lista + mapa: oficiales y avisos. Todo con su origen a la vista.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="band sky" id="caminos">
      <div class="wrap">
        <p class="section-kicker">Tres caminos</p>
        <h2 class="dark">Buscar, ayudar o publicar.</h2>
        <div class="paths">
          <a class="path" routerLink="/buscar">
            <span class="label">Buscar</span>
            <strong>¿Qué necesitas?</strong>
            <p>Categorías claras + ciudad. Luego ves lugares en lista (cards), no un mapa lleno.</p>
            <span class="go">Empezar →</span>
          </a>
          <a class="path alt" routerLink="/ayudar">
            <span class="label">Directorio</span>
            <strong>Dónde ayudar</strong>
            <p>Organizaciones y puntos en todo el país. Filtra y abre su canal.</p>
            <span class="go">Ver lista →</span>
          </a>
          <a class="path" routerLink="/publicar-punto">
            <span class="label">Aportar</span>
            <strong>Publicar un lugar</strong>
            <p>Si tu acopio u ONG necesita apoyo, publícalo con ciudad y enlace.</p>
            <span class="go">Publicar →</span>
          </a>
        </div>
        <a class="trust-link" routerLink="/fuentes">¿De dónde sale la información? Ver Confianza →</a>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        background: var(--ink);
        color: #f7f3ec;
        position: relative;
        overflow: hidden;
        padding: 2.4rem 0 3rem;
      }
      .hero::before {
        content: '';
        position: absolute;
        width: 420px;
        height: 420px;
        right: -120px;
        top: -80px;
        border: 40px solid rgba(228, 87, 76, 0.18);
        border-radius: 40% 60% 55% 45%;
        animation: drift 12s ease-in-out infinite;
        pointer-events: none;
      }
      .hero::after {
        content: '';
        position: absolute;
        width: 280px;
        height: 280px;
        left: -90px;
        bottom: -100px;
        background: rgba(15, 110, 106, 0.35);
        border-radius: 32px;
        transform: rotate(18deg);
        pointer-events: none;
      }
      .hero-grid {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
        display: grid;
        gap: 1.5rem;
        position: relative;
        z-index: 1;
      }
      @media (min-width: 920px) {
        .hero {
          padding: 3.5rem 0 4rem;
        }
        .hero-grid {
          grid-template-columns: 1.35fr 0.85fr;
          align-items: stretch;
          gap: 2rem;
        }
      }
      .eyebrow {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.78rem;
        color: rgba(247, 243, 236, 0.7);
      }
      h1 {
        margin: 0.7rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 6.5vw, 3.35rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        font-weight: 800;
      }
      h1 span {
        color: #ffb4ad;
      }
      .lead {
        margin: 1rem 0 0;
        max-width: 38rem;
        font-size: 1.05rem;
        color: rgba(247, 243, 236, 0.78);
        font-weight: 600;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 1.5rem;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: var(--tap);
        padding: 0 1.25rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 800;
      }
      .btn.coral {
        background: var(--coral);
        color: #fff;
      }
      .btn.ghost {
        border: 1.5px solid rgba(255, 255, 255, 0.35);
        color: #fff;
      }
      .sos {
        display: inline-block;
        margin-top: 1rem;
        color: rgba(247, 243, 236, 0.7);
        font-weight: 700;
        font-size: 0.92rem;
      }
      .hero-panel {
        background: rgba(255, 252, 247, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 24px;
        padding: 1.25rem 1.2rem 1.3rem;
        backdrop-filter: blur(6px);
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }
      .panel-head {
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.75rem;
        color: rgba(247, 243, 236, 0.65);
      }
      .stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .stats div {
        background: rgba(0, 0, 0, 0.18);
        border-radius: 16px;
        padding: 0.9rem 0.85rem;
      }
      .stats strong {
        display: block;
        font-family: var(--font-display);
        font-size: 2rem;
        line-height: 1;
        color: #fff;
      }
      .stats span {
        display: block;
        margin-top: 0.4rem;
        font-size: 0.82rem;
        font-weight: 700;
        color: rgba(247, 243, 236, 0.7);
      }
      .panel-note,
      .loading {
        margin: 0;
        font-size: 0.88rem;
        font-weight: 600;
        color: rgba(247, 243, 236, 0.68);
      }
      .geo {
        display: flex;
        align-items: flex-end;
        gap: 0.45rem;
        height: 64px;
        margin-top: auto;
      }
      .bar {
        flex: 1;
        height: 100%;
        border-radius: 10px 10px 4px 4px;
        background: rgba(15, 110, 106, 0.85);
      }
      .bar.short {
        height: 42%;
        background: rgba(228, 87, 76, 0.85);
      }
      .bar.mid {
        height: 68%;
        background: rgba(220, 234, 245, 0.55);
      }
      .band {
        padding: 3.2rem 0;
      }
      .band.teal {
        background: var(--teal);
        color: #f3fffc;
      }
      .band.cream {
        background: var(--cream);
        color: var(--ink);
      }
      .band.sky {
        background: var(--sky-band);
        color: var(--ink);
      }
      .wrap {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .band-kicker,
      .section-kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-size: 0.78rem;
        opacity: 0.8;
      }
      .section-kicker {
        color: var(--teal);
        opacity: 1;
      }
      .band h2 {
        margin: 0.65rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 4.5vw, 2.55rem);
        line-height: 1.12;
        letter-spacing: -0.02em;
        max-width: 20ch;
      }
      .band h2.dark {
        color: var(--ink);
      }
      .split {
        display: grid;
        gap: 1rem;
        margin-top: 1.4rem;
      }
      @media (min-width: 800px) {
        .split {
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
        }
      }
      .split p {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: rgba(243, 255, 252, 0.88);
      }
      .steps {
        list-style: none;
        margin: 1.6rem 0 0;
        padding: 0;
        display: grid;
        gap: 0.85rem;
      }
      @media (min-width: 860px) {
        .steps {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .steps li {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 1.2rem 1.15rem;
        display: grid;
        gap: 0.85rem;
        box-shadow: var(--shadow);
      }
      .num {
        font-family: var(--font-display);
        font-size: 1.6rem;
        color: var(--coral);
        font-weight: 800;
      }
      .steps h3 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.2rem;
      }
      .steps p {
        margin: 0.4rem 0 0;
        color: var(--muted);
        font-weight: 600;
      }
      .paths {
        display: grid;
        gap: 0.9rem;
        margin-top: 1.5rem;
      }
      @media (min-width: 900px) {
        .paths {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }
      .path {
        text-decoration: none;
        background: var(--white);
        border-radius: 22px;
        padding: 1.35rem 1.25rem 1.25rem;
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
        display: grid;
        gap: 0.4rem;
        min-height: 220px;
        transition: transform 0.2s var(--ease);
      }
      .path:hover {
        transform: translateY(-3px);
      }
      .path.alt {
        background: var(--ink);
        color: #f7f3ec;
        border-color: transparent;
      }
      .label {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--coral);
      }
      .path.alt .label {
        color: #ffb4ad;
      }
      .path strong {
        font-family: var(--font-display);
        font-size: 1.55rem;
        letter-spacing: -0.02em;
      }
      .path p {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
      }
      .path.alt p {
        color: rgba(247, 243, 236, 0.72);
      }
      .go {
        margin-top: auto;
        padding-top: 1rem;
        font-weight: 800;
        color: var(--teal);
      }
      .path.alt .go {
        color: #fff;
      }
      .trust-link {
        display: inline-block;
        margin-top: 1.25rem;
        font-weight: 800;
        color: var(--ink);
      }
    `,
  ],
})
export class HomePageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly places = signal(0);
  readonly needs = signal(0);
  readonly loaded = signal(false);

  ngOnInit(): void {
    let left = 2;
    const done = () => {
      left -= 1;
      if (left <= 0) this.loaded.set(true);
    };
    this.api.places({ origin: 'community', limit: 200 }).subscribe({
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
  }
}
