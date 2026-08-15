import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import type { CityDto, NeedCategory, NeedDto, NeedIntent } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { CITY_CHIPS, FORUM_CATEGORIES, forumCatLabel } from '../help-categories';

/** Avisos de ejemplo para ver el muro (no son datos reales). */
const DEMO: NeedDto[] = [
  {
    id: 'demo-n-water-1',
    category: 'WATER',
    intent: 'NEED',
    description: 'Necesitamos agua potable para 4 personas en el barrio. Cualquier ayuda sirve.',
    geometry: { type: 'Point', coordinates: [-76.66, 5.69] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '27001',
    municipality: 'Quibdó',
    contactWhatsapp: '573001112233',
  },
  {
    id: 'demo-n-water-2',
    category: 'WATER',
    intent: 'NEED',
    description: 'Se agotó el agua en el albergue improvisado. Buscamos bidones o botellones.',
    geometry: { type: 'Point', coordinates: [-75.69, 4.81] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '66001',
    municipality: 'Pereira',
    contactWhatsapp: '573004445566',
  },
  {
    id: 'demo-o-water-1',
    category: 'WATER',
    intent: 'OFFER',
    description: 'Tengo 2 canecas limpias y puedo acercar agua esta tarde por el norte de la ciudad.',
    geometry: { type: 'Point', coordinates: [-74.08, 4.65] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '11001',
    municipality: 'Bogotá',
    contactWhatsapp: '573007778899',
  },
  {
    id: 'demo-n-food-1',
    category: 'FOOD',
    intent: 'NEED',
    description: 'Familia de 5: faltan mercados no perecederos (arroz, atún, leche en polvo).',
    geometry: { type: 'Point', coordinates: [-75.57, 6.25] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '05001',
    municipality: 'Medellín',
    contactWhatsapp: '573001234567',
  },
  {
    id: 'demo-o-food-1',
    category: 'FOOD',
    intent: 'OFFER',
    description: 'Tengo mercado empacado y no sé a dónde llevarlo. Puedo entregar hoy en la tarde.',
    geometry: { type: 'Point', coordinates: [-74.08, 4.65] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '11001',
    municipality: 'Bogotá',
    contactWhatsapp: '573009998877',
  },
  {
    id: 'demo-o-food-2',
    category: 'FOOD',
    intent: 'OFFER',
    description: 'Cocino 20 raciones de sopa esta noche si alguien coordina el punto de entrega.',
    geometry: { type: 'Point', coordinates: [-76.53, 3.45] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '76001',
    municipality: 'Cali',
    contactWhatsapp: null,
  },
  {
    id: 'demo-n-transport-1',
    category: 'TRANSPORT',
    intent: 'NEED',
    description: 'Necesito un vehículo para llevar donaciones desde el centro hasta la zona afectada.',
    geometry: { type: 'Point', coordinates: [-75.52, 5.07] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
    source: 'USER',
    cityCode: '17001',
    municipality: 'Manizales',
    contactWhatsapp: '573002223344',
  },
  {
    id: 'demo-o-transport-1',
    category: 'TRANSPORT',
    intent: 'OFFER',
    description: 'Tengo camioneta disponible mañana 8–12. Puedo mover cajas o personas (sin cobro).',
    geometry: { type: 'Point', coordinates: [-75.57, 6.25] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '05001',
    municipality: 'Medellín',
    contactWhatsapp: '573005556677',
  },
  {
    id: 'demo-n-vol-1',
    category: 'VOLUNTEER',
    intent: 'NEED',
    description: 'Hacen falta manos para clasificar ropa y armar kits esta tarde.',
    geometry: { type: 'Point', coordinates: [-73.12, 7.12] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 50 * 60_000).toISOString(),
    source: 'USER',
    cityCode: '68001',
    municipality: 'Bucaramanga',
    contactWhatsapp: '573008887766',
  },
  {
    id: 'demo-o-vol-1',
    category: 'VOLUNTEER',
    intent: 'OFFER',
    description: 'Quiero ayudar: puedo clasificar donaciones o repartir. Disponible fin de semana.',
    geometry: { type: 'Point', coordinates: [-76.66, 5.69] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 10 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '27001',
    municipality: 'Quibdó',
    contactWhatsapp: '573003334455',
  },
  {
    id: 'demo-n-cloth-1',
    category: 'CLOTHING',
    intent: 'NEED',
    description: 'Cobijas y ropa para niños. Zona fría, preferible talla pequeña.',
    geometry: { type: 'Point', coordinates: [-75.23, 4.44] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 7 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '73001',
    municipality: 'Ibagué',
    contactWhatsapp: '573006667788',
  },
  {
    id: 'demo-o-cloth-1',
    category: 'CLOTHING',
    intent: 'OFFER',
    description: 'Tengo ropa y cobijas limpias listas. Busco un punto de acopio cercano.',
    geometry: { type: 'Point', coordinates: [-74.78, 10.97] },
    verification: 'UNVERIFIED',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 12 * 3600_000).toISOString(),
    source: 'USER',
    cityCode: '08001',
    municipality: 'Barranquilla',
    contactWhatsapp: '573001122334',
  },
];

@Component({
  selector: 'aee-buscar-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink, DatePipe],
  template: `
    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">Comunidad que se conecta</p>
        <h1>¿Qué necesitas?</h1>
        <p class="lead">
          Una red simple para pedir o ofrecer ayuda en emergencia.
          <strong>Sin intermediarnos:</strong> tú publicas, alguien te escribe.
        </p>
      </div>
    </section>

    <section class="page">
      <div class="wrap">
        <div class="tabs" role="tablist" aria-label="Tipo de aviso">
          <button
            type="button"
            role="tab"
            [class.on]="intent === 'NEED'"
            [attr.aria-selected]="intent === 'NEED'"
            (click)="setIntent('NEED')"
          >
            Necesito ayuda
          </button>
          <button
            type="button"
            role="tab"
            [class.on]="intent === 'OFFER'"
            [attr.aria-selected]="intent === 'OFFER'"
            (click)="setIntent('OFFER')"
          >
            Puedo aportar
          </button>
        </div>

        <p class="prompt" *ngIf="!intent">Elige si necesitas ayuda o si puedes aportar.</p>

        <ng-container *ngIf="intent">
          <p class="label">Categoría</p>
          <div class="cats" role="list">
            <button
              type="button"
              class="cat"
              *ngFor="let c of cats"
              [class.on]="category === c.id"
              (click)="setCategory(c.id)"
            >
              {{ c.title }}
            </button>
          </div>

          <p class="prompt soft" *ngIf="!category">
            Elige una categoría para ver el muro
            {{ intent === 'NEED' ? 'de quien necesita' : 'de quien puede aportar' }}.
          </p>
        </ng-container>

        <ng-container *ngIf="intent && category">
          <div class="toolbar">
            <div>
              <h2>{{ forumCatLabel(category) }}</h2>
              <p class="sub">
                {{ intent === 'NEED' ? 'Quien necesita ayuda' : 'Quien puede aportar' }}
                · {{ posts().length }} aviso{{ posts().length === 1 ? '' : 's' }}
                <span class="demo-note" *ngIf="hasDemo()"> · incluye ejemplos</span>
              </p>
            </div>
            <button type="button" class="pub" (click)="showForm.set(!showForm())">
              {{ showForm() ? 'Cerrar' : intent === 'NEED' ? 'Publicar necesidad' : 'Publicar aporte' }}
            </button>
          </div>

          <div class="composer" *ngIf="showForm()">
            <div class="composer-grid">
              <label class="field">
                Ciudad
                <select [(ngModel)]="cityCode">
                  <option value="">Elige ciudad</option>
                  <option *ngFor="let c of postCities" [value]="c.code">{{ c.label }}</option>
                  <option *ngFor="let c of extraCities()" [value]="c.code">
                    {{ c.name }} — {{ c.department }}
                  </option>
                </select>
              </label>
              <label class="field">
                WhatsApp (opcional)
                <input [(ngModel)]="whatsapp" inputmode="tel" placeholder="300 123 4567" />
              </label>
            </div>
            <label class="field">
              Tu mensaje
              <textarea
                [(ngModel)]="description"
                rows="3"
                maxlength="2000"
                [placeholder]="
                  intent === 'NEED'
                    ? 'Ej. Necesito agua en mi barrio…'
                    : 'Ej. Tengo vehículo libre para llevar ayudas…'
                "
              ></textarea>
            </label>
            <p class="fine">No verificamos contactos. Urgencias graves: 123.</p>
            <button type="button" class="send" [disabled]="posting()" (click)="publish()">
              {{ posting() ? 'Publicando…' : 'Publicar en el muro' }}
            </button>
            <p class="toast ok" *ngIf="ok()">{{ ok() }}</p>
            <p class="toast err" *ngIf="formError()">{{ formError() }}</p>
          </div>

          <div class="city-row">
            <button
              type="button"
              class="chip"
              *ngFor="let c of cityChips"
              [class.on]="filterCity === c.code"
              (click)="setFilterCity(c.code)"
            >
              {{ c.label }}
            </button>
          </div>

          <ul class="feed" *ngIf="posts().length; else empty">
            <li *ngFor="let n of posts()">
              <article class="card" [class.demo]="isDemo(n)">
                <div class="card-top">
                  <span class="avatar" [class.offer]="n.intent === 'OFFER'" aria-hidden="true">{{
                    initials(n)
                  }}</span>
                  <div class="who">
                    <strong>{{ shortWho(n) }}</strong>
                    <span class="tag" [class.offer]="n.intent === 'OFFER'">
                      {{ n.intent === 'OFFER' ? 'Puede aportar' : 'Necesita ayuda' }}
                    </span>
                    <span class="ex" *ngIf="isDemo(n)">Ejemplo</span>
                  </div>
                </div>
                <p class="msg">{{ n.description }}</p>
                <p class="meta">
                  {{ n.municipality || 'Sin ciudad' }}
                  · {{ n.createdAt | date: 'd MMM y, HH:mm' }}
                </p>
                <a
                  *ngIf="n.contactWhatsapp && !isDemo(n)"
                  class="wa"
                  [href]="waLink(n)"
                  target="_blank"
                  rel="noopener"
                  >Contactar por WhatsApp</a
                >
                <button
                  *ngIf="n.contactWhatsapp && isDemo(n)"
                  type="button"
                  class="wa"
                  disabled
                  title="Ejemplo de vista"
                >
                  Contactar por WhatsApp
                </button>
                <p class="no-wa" *ngIf="!n.contactWhatsapp">Sin WhatsApp en este aviso</p>
              </article>
            </li>
          </ul>
          <ng-template #empty>
            <div class="empty" *ngIf="!loading()">
              <strong>Aún no hay avisos en esta categoría.</strong>
              <p>Sé el primero en publicar con el botón de arriba.</p>
            </div>
          </ng-template>
        </ng-container>

        <p class="dir">
          ¿Buscas un acopio u organización?
          <a routerLink="/ayudar">Ir al directorio →</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        color: #f7f3ec;
        padding: 2.8rem 1rem 3rem;
        text-align: center;
        background: var(--ink);
      }
      .hero-inner {
        width: min(720px, 100%);
        margin: 0 auto;
      }
      .kicker {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-size: 0.75rem;
        opacity: 0.7;
      }
      h1 {
        margin: 0.65rem 0 0;
        font-family: var(--font-display);
        font-size: clamp(2.2rem, 6.5vw, 3.3rem);
        letter-spacing: -0.035em;
        line-height: 1.05;
      }
      .lead {
        margin: 0.95rem auto 0;
        max-width: 34rem;
        font-size: 1.08rem;
        font-weight: 600;
        line-height: 1.45;
        color: rgba(247, 243, 236, 0.86);
      }
      .page {
        background: #f3f0ea;
        padding: 1.5rem 0 3.5rem;
        min-height: 50vh;
      }
      .wrap {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1.15rem;
        max-width: 560px;
      }
      .tabs button {
        min-height: 52px;
        border-radius: 14px;
        border: 1px solid var(--line);
        background: #fff;
        font-weight: 800;
        font-size: 1rem;
        cursor: pointer;
      }
      .tabs button.on:first-child {
        background: var(--coral);
        color: #fff;
        border-color: transparent;
      }
      .tabs button.on:last-child {
        background: var(--teal);
        color: #fff;
        border-color: transparent;
      }
      .prompt {
        margin: 0 0 1rem;
        font-weight: 700;
        color: var(--ink-soft);
      }
      .prompt.soft {
        color: var(--muted);
        font-weight: 600;
      }
      .label {
        margin: 0 0 0.5rem;
        font-weight: 800;
        font-size: 0.78rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .cats {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 1.2rem;
      }
      .cat {
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 999px;
        padding: 0.55rem 1rem;
        font-weight: 800;
        font-size: 0.92rem;
        cursor: pointer;
      }
      .cat.on {
        background: var(--ink);
        color: #fff;
        border-color: transparent;
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
        justify-content: space-between;
        align-items: end;
        margin-bottom: 1rem;
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(1.35rem, 3vw, 1.7rem);
      }
      .sub {
        margin: 0.25rem 0 0;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.92rem;
      }
      .demo-note {
        color: var(--teal);
        font-weight: 800;
      }
      .pub {
        min-height: 46px;
        border-radius: 999px;
        border: 0;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        padding: 0 1.15rem;
        cursor: pointer;
      }
      .composer {
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 1.15rem;
        margin-bottom: 1rem;
        display: grid;
        gap: 0.7rem;
        box-shadow: var(--shadow);
      }
      .composer-grid {
        display: grid;
        gap: 0.7rem;
      }
      @media (min-width: 720px) {
        .composer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .field {
        display: grid;
        gap: 0.3rem;
        font-weight: 800;
        font-size: 0.8rem;
      }
      .field input,
      .field select,
      .field textarea {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 0.7rem 0.85rem;
        font-weight: 600;
        background: #fff;
      }
      .fine {
        margin: 0;
        font-size: 0.78rem;
        color: var(--muted);
        font-weight: 600;
      }
      .send {
        min-height: 48px;
        border: 0;
        border-radius: 999px;
        background: var(--coral);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
        max-width: 280px;
      }
      .send:disabled {
        opacity: 0.6;
      }
      .toast {
        margin: 0;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .toast.ok {
        color: var(--teal-deep);
      }
      .toast.err {
        color: var(--coral-deep);
      }
      .city-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 1rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 999px;
        padding: 0.4rem 0.75rem;
        font-weight: 800;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .chip.on {
        background: #2f6fed;
        color: #fff;
        border-color: transparent;
      }
      .feed {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.85rem;
      }
      @media (min-width: 760px) {
        .feed {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (min-width: 1080px) {
        .feed {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }
      .card {
        background: #fff;
        border-radius: 20px;
        padding: 1.1rem 1.15rem 1.15rem;
        box-shadow: 0 12px 32px rgba(16, 35, 63, 0.07);
        border: 1px solid rgba(16, 35, 63, 0.06);
        display: grid;
        gap: 0.6rem;
        min-height: 100%;
        transition: transform 0.18s var(--ease);
      }
      .card:hover {
        transform: translateY(-2px);
      }
      .card.demo {
        background: linear-gradient(180deg, #fff 0%, #f7fbff 100%);
      }
      .card-top {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(145deg, var(--coral), #c9443b);
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 800;
        flex: 0 0 auto;
      }
      .avatar.offer {
        background: linear-gradient(145deg, var(--teal), #0a524f);
      }
      .who {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
        padding-top: 0.15rem;
      }
      .who strong {
        font-family: var(--font-display);
        font-size: 1.08rem;
        width: 100%;
      }
      .tag {
        background: #f8d7d3;
        color: var(--coral-deep);
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.28rem 0.55rem;
        border-radius: 8px;
      }
      .tag.offer {
        background: #d8f0ec;
        color: var(--teal-deep);
      }
      .ex {
        background: var(--sky-band);
        color: var(--ink-soft);
        font-size: 0.7rem;
        font-weight: 800;
        padding: 0.25rem 0.5rem;
        border-radius: 8px;
      }
      .msg {
        margin: 0;
        font-weight: 600;
        line-height: 1.45;
        color: var(--ink-soft);
        font-size: 1rem;
      }
      .meta {
        margin: 0;
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--muted);
      }
      .wa {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        border-radius: 14px;
        background: #25d366;
        color: #fff;
        text-decoration: none;
        font-weight: 800;
        border: 0;
        font: inherit;
        cursor: pointer;
        margin-top: auto;
      }
      .wa:disabled {
        opacity: 0.75;
        cursor: default;
      }
      .no-wa {
        margin: 0;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--muted);
      }
      .empty {
        background: #fff;
        border: 1px dashed var(--line);
        border-radius: 16px;
        padding: 1.4rem;
        display: grid;
        gap: 0.35rem;
      }
      .empty strong {
        font-family: var(--font-display);
      }
      .empty p {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
      }
      .dir {
        margin: 1.75rem 0 0;
        text-align: center;
        font-weight: 600;
        color: var(--muted);
      }
      .dir a {
        color: var(--teal);
        font-weight: 800;
      }
    `,
  ],
})
export class BuscarPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly cats = FORUM_CATEGORIES;
  readonly cityChips = CITY_CHIPS;
  readonly postCities = CITY_CHIPS.filter((c) => Boolean(c.code));
  readonly cities = signal<CityDto[]>([]);
  readonly posts = signal<NeedDto[]>([]);
  readonly loading = signal(false);
  readonly posting = signal(false);
  readonly showForm = signal(false);
  readonly ok = signal<string | null>(null);
  readonly formError = signal<string | null>(null);

  intent: NeedIntent | null = null;
  category: NeedCategory | null = null;
  cityCode = '';
  description = '';
  whatsapp = '';
  filterCity = '';

  readonly forumCatLabel = forumCatLabel;

  ngOnInit(): void {
    this.api.cities().subscribe({
      next: (res) => this.cities.set(res.data),
      error: () => undefined,
    });
    this.route.queryParamMap.subscribe((q) => {
      const intent = q.get('intent');
      if (intent === 'OFFER' || intent === 'NEED') {
        this.setIntent(intent);
      }
    });
  }

  extraCities(): CityDto[] {
    const chipCodes = new Set(CITY_CHIPS.map((c) => c.code).filter(Boolean));
    return this.cities()
      .filter((c) => !chipCodes.has(c.code))
      .slice(0, 30);
  }

  setIntent(intent: NeedIntent): void {
    this.intent = intent;
    this.category = null;
    this.posts.set([]);
    this.showForm.set(false);
    this.ok.set(null);
    this.formError.set(null);
  }

  setCategory(id: NeedCategory): void {
    this.category = this.category === id ? null : id;
    this.showForm.set(false);
    if (this.category) this.reload();
    else this.posts.set([]);
  }

  setFilterCity(code: string): void {
    this.filterCity = code;
    this.reload();
  }

  isDemo(n: NeedDto): boolean {
    return n.id.startsWith('demo-');
  }

  hasDemo(): boolean {
    return this.posts().some((p) => this.isDemo(p));
  }

  reload(): void {
    if (!this.intent || !this.category) return;
    this.loading.set(true);
    const intent = this.intent;
    const category = this.category;
    const city = this.filterCity;

    const demos = DEMO.filter(
      (d) =>
        d.intent === intent &&
        d.category === category &&
        (!city || d.cityCode === city),
    );

    this.api
      .needs({
        intent,
        category,
        cityCode: city || undefined,
      })
      .subscribe({
        next: (res) => {
          const live = res.data.filter((p) => !p.id.startsWith('demo-'));
          this.posts.set([...live, ...demos]);
          this.loading.set(false);
        },
        error: () => {
          this.posts.set(demos);
          this.loading.set(false);
        },
      });
  }

  publish(): void {
    this.ok.set(null);
    this.formError.set(null);
    if (!this.intent || !this.category) return;
    if (!this.cityCode) {
      this.formError.set('Elige una ciudad.');
      return;
    }
    if (this.description.trim().length < 8) {
      this.formError.set('Escribe un mensaje un poco más largo.');
      return;
    }
    this.posting.set(true);
    this.api
      .createNeed({
        intent: this.intent,
        category: this.category,
        description: this.description.trim(),
        cityCode: this.cityCode,
        contactWhatsapp: this.whatsapp.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.posting.set(false);
          this.ok.set('Publicado. Caduca en ~72 horas.');
          this.description = '';
          this.whatsapp = '';
          this.showForm.set(false);
          this.reload();
        },
        error: (err) => {
          this.posting.set(false);
          const msg =
            err?.error?.message ||
            (Array.isArray(err?.error?.message) ? err.error.message.join(', ') : null) ||
            'No se pudo publicar.';
          this.formError.set(typeof msg === 'string' ? msg : 'No se pudo publicar.');
        },
      });
  }

  initials(n: NeedDto): string {
    const base = (n.municipality || n.category || 'AY').replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g, ' ');
    const parts = base.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'AY';
  }

  shortWho(n: NeedDto): string {
    if (n.intent === 'OFFER') return n.municipality ? `Aporte · ${n.municipality}` : 'Alguien aporta';
    return n.municipality ? `Pedido · ${n.municipality}` : 'Alguien necesita';
  }

  waLink(n: NeedDto): string {
    const phone = n.contactWhatsapp ?? '';
    const text = encodeURIComponent(
      `Hola, vi tu aviso en Ayuda en Emergencias (${forumCatLabel(n.category)}): ${n.description.slice(0, 140)}`,
    );
    return `https://wa.me/${phone}?text=${text}`;
  }
}
