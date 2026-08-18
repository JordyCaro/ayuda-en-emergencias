import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type {
  CityDto,
  PetReportDto,
  PetReportKind,
  PetSpecies,
  PersonReportDto,
  PersonReportKind,
} from '@aee/shared-types';
import { ApiService } from '../api.service';
import { CITY_CHIPS } from '../help-categories';

@Component({
  selector: 'aee-perdidos-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Colombia · comunidad</p>
        <h1>Perdidos y encontrados</h1>
        <p class="lead">
          Cobertura nacional. Mascotas: publica una señal en tu municipio. Personas: canales
          oficiales (RND/SIRDEC) y avisos de la comunidad (sin verificar).
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap wide" [class.people-wide]="tab === 'people'">
        <div class="tabs" role="tablist">
          <button
            type="button"
            class="tab"
            [class.on]="tab === 'pets'"
            (click)="setTab('pets')"
          >
            Mascotas
          </button>
          <button
            type="button"
            class="tab"
            [class.on]="tab === 'people'"
            (click)="setTab('people')"
          >
            Personas
          </button>
        </div>

        <ng-container *ngIf="tab === 'people'">
          <div class="people-layout">
            <aside class="rail" aria-label="Canales oficiales">
              <article class="rail-card urgent">
                <strong>¿Alguien en peligro ahora?</strong>
                <p>Llama al 123. Si puede pedir ayuda, usa <a routerLink="/">Estoy aquí y necesito ayuda</a>.</p>
                <a class="rail-cta" href="tel:123">Llamar 123</a>
              </article>
              <article class="rail-card">
                <strong>Consulta SIRDEC</strong>
                <p>Búsqueda pública nacional de desaparecidos.</p>
                <a
                  href="https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml"
                  target="_blank"
                  rel="noopener"
                  >Ir a la consulta</a
                >
              </article>
            </aside>

            <div class="people-main">
              <p class="intro">
                Señales de todo el país (sin verificar). Filtra por ciudad si quieres, o deja
                <strong>Todo el país</strong>. No reemplaza al RND: 123, SIRDEC y el portal
                siguen en las fichas oficiales.
              </p>

              <div class="filters panel">
                <div class="chips">
                  <button type="button" class="chip" [class.on]="!peopleKind" (click)="setPeopleKind(null)">
                    Todas
                  </button>
                  <button
                    type="button"
                    class="chip"
                    [class.on]="peopleKind === 'LOOKING'"
                    (click)="setPeopleKind('LOOKING')"
                  >
                    Las busco
                  </button>
                  <button
                    type="button"
                    class="chip"
                    [class.on]="peopleKind === 'SEEN'"
                    (click)="setPeopleKind('SEEN')"
                  >
                    Se vieron
                  </button>
                  <button
                    type="button"
                    class="chip"
                    [class.on]="peopleKind === 'FOUND'"
                    (click)="setPeopleKind('FOUND')"
                  >
                    Las encontré
                  </button>
                </div>
                <p class="label">Zona</p>
                <div class="chips">
                  <button
                    type="button"
                    class="chip soft"
                    *ngFor="let c of cityChips"
                    [class.on]="peopleFilterCity === c.code"
                    (click)="setPeopleFilterCity(c.code)"
                  >
                    {{ c.label }}
                  </button>
                </div>
                <button type="button" class="cta" (click)="showPeopleForm.set(!showPeopleForm())">
                  {{ showPeopleForm() ? 'Cerrar formulario' : 'Publicar aviso' }}
                </button>
              </div>

              <form class="panel form" *ngIf="showPeopleForm()" (ngSubmit)="publishPerson()">
                <p class="label">¿Qué pasó?</p>
                <div class="chips">
                  <button type="button" class="chip" [class.on]="pFormKind === 'LOOKING'" (click)="pFormKind = 'LOOKING'">
                    La busco
                  </button>
                  <button type="button" class="chip" [class.on]="pFormKind === 'SEEN'" (click)="pFormKind = 'SEEN'">
                    Se vio / desorientada
                  </button>
                  <button type="button" class="chip" [class.on]="pFormKind === 'FOUND'" (click)="pFormKind = 'FOUND'">
                    La encontré
                  </button>
                </div>
                <label>
                  Municipio
                  <input
                    [(ngModel)]="pCityQuery"
                    name="pCityQuery"
                    (ngModelChange)="onPeopleCityQuery($event)"
                    placeholder="Escribe: Pasto, Cali, Quibdó…"
                    autocomplete="off"
                  />
                </label>
                <ul class="city-hits" *ngIf="pCityHits().length && !pFormCity">
                  <li *ngFor="let c of pCityHits()">
                    <button type="button" (click)="pickPeopleCity(c)">
                      {{ c.name }} — {{ c.department }}
                    </button>
                  </li>
                </ul>
                <p class="picked" *ngIf="pFormCityLabel()">Municipio: {{ pFormCityLabel() }}</p>
                <label>
                  Descripción
                  <textarea
                    [(ngModel)]="pFormDesc"
                    name="pDesc"
                    rows="4"
                    maxlength="2000"
                    placeholder="Cómo vestía, barrio o vía, cuándo se vio… Sin cédula ni datos de menores."
                  ></textarea>
                </label>
                <label>
                  WhatsApp (opcional)
                  <input [(ngModel)]="pFormWa" name="pWa" maxlength="20" placeholder="3001234567" />
                </label>
                <label>
                  Foto (opcional)
                  <input type="file" accept="image/*" name="pPhoto" (change)="onPeoplePhoto($event)" />
                </label>
                <p class="picked" *ngIf="pPhotoPreview()">Foto lista para publicar.</p>
                <p class="ttl">
                  El aviso se verá <strong>7 días</strong> y luego se borra. También reporta en RND/123.
                </p>
                <p class="err" *ngIf="pFormError()">{{ pFormError() }}</p>
                <p class="ok" *ngIf="pOk()">{{ pOk() }}</p>
                <div class="manage" *ngIf="pManageLink()">
                  <p>
                    <strong>Guarda este enlace</strong> para cerrar el aviso:
                  </p>
                  <a [href]="pManageLink()">{{ pManageLink() }}</a>
                  <button type="button" class="copy" (click)="copyPeopleManage()">Copiar enlace</button>
                </div>
                <button type="submit" class="cta" [disabled]="pPosting()">
                  {{ pPosting() ? 'Publicando…' : 'Publicar aviso' }}
                </button>
              </form>

              <p class="err" *ngIf="pListError()">{{ pListError() }}</p>
              <p class="count" *ngIf="!pLoading() && !pListError()">
                {{ people().length }} aviso{{ people().length === 1 ? '' : 's' }}
              </p>
              <ul class="feed" *ngIf="people().length; else peopleEmpty">
                <li *ngFor="let p of people()">
                  <article>
                    <img
                      *ngIf="p.hasPhoto"
                      class="pet-photo"
                      [src]="api.personPhotoUrl(p.id)"
                      alt="Foto del aviso"
                    />
                    <div class="top">
                      <span class="tag" [class.found]="p.kind === 'FOUND'">{{ personKindLabel(p.kind) }}</span>
                    </div>
                    <p class="desc">{{ p.description }}</p>
                    <div class="foot">
                      <span>{{ p.municipality || 'Colombia' }}</span>
                      <span>{{ p.createdAt | date: 'd MMM, HH:mm' }}</span>
                    </div>
                    <a
                      *ngIf="p.contactWhatsapp"
                      class="wa"
                      [href]="personWaUrl(p)"
                      target="_blank"
                      rel="noopener"
                      >WhatsApp</a
                    >
                  </article>
                </li>
              </ul>
              <ng-template #peopleEmpty>
                <div class="empty" *ngIf="!pLoading() && !pListError()">
                  <strong>Aún no hay avisos con esos filtros.</strong>
                  <p>Puedes publicar desde cualquier municipio del país.</p>
                </div>
              </ng-template>
            </div>

            <p class="official-kicker">Canales oficiales</p>

            <aside class="rail" aria-label="Registro oficial">
              <article class="rail-card">
                <strong>Portal RND</strong>
                <p>Registro Nacional de Desaparecidos (Medicina Legal).</p>
                <a
                  href="https://www.medicinalegal.gov.co/rnd-registro-de-desaparecidos"
                  target="_blank"
                  rel="noopener"
                  >Abrir portal</a
                >
              </article>
              <article class="rail-card">
                <strong>Líneas</strong>
                <p>123 urgencia · 141 niñez · 155 género.</p>
                <div class="row-links">
                  <a href="tel:123">123</a>
                  <a href="tel:141">141</a>
                  <a href="tel:155">155</a>
                </div>
                <a routerLink="/origenes">Más canales</a>
              </article>
            </aside>
          </div>
        </ng-container>

        <ng-container *ngIf="tab === 'pets'">
          <p class="intro">
            Señales de todo el país (sin verificar). Filtra por ciudad si quieres, o deja
            <strong>Todo el país</strong>. Al publicar, elige el municipio (no hace falta estar en
            Bogotá).
          </p>

          <div class="filters panel">
            <div class="chips">
              <button type="button" class="chip" [class.on]="!kind" (click)="setKind(null)">
                Todas
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="kind === 'LOST'"
                (click)="setKind('LOST')"
              >
                Perdidas
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="kind === 'FOUND'"
                (click)="setKind('FOUND')"
              >
                Encontradas
              </button>
            </div>
            <p class="label">Zona</p>
            <div class="chips">
              <button
                type="button"
                class="chip soft"
                *ngFor="let c of cityChips"
                [class.on]="filterCity === c.code"
                (click)="setFilterCity(c.code)"
              >
                {{ c.label }}
              </button>
            </div>
            <button type="button" class="cta" (click)="showForm.set(!showForm())">
              {{ showForm() ? 'Cerrar formulario' : 'Publicar mascota' }}
            </button>
          </div>

          <form class="panel form" *ngIf="showForm()" (ngSubmit)="publish()">
            <p class="label">¿Perdida o encontrada?</p>
            <div class="chips">
              <button
                type="button"
                class="chip"
                [class.on]="formKind === 'LOST'"
                (click)="formKind = 'LOST'"
              >
                La perdí
              </button>
              <button
                type="button"
                class="chip"
                [class.on]="formKind === 'FOUND'"
                (click)="formKind = 'FOUND'"
              >
                La encontré
              </button>
            </div>
            <p class="label">Especie</p>
            <div class="chips">
              <button
                type="button"
                class="chip soft"
                *ngFor="let s of speciesOpts"
                [class.on]="formSpecies === s.id"
                (click)="formSpecies = s.id"
              >
                {{ s.label }}
              </button>
            </div>
            <label>
              Municipio (cualquier ciudad de Colombia)
              <input
                [(ngModel)]="cityQuery"
                name="cityQuery"
                (ngModelChange)="onCityQuery($event)"
                placeholder="Escribe: Pasto, Cali, Quibdó, Leticia…"
                autocomplete="off"
              />
            </label>
            <ul class="city-hits" *ngIf="cityHits().length && !formCity">
              <li *ngFor="let c of cityHits()">
                <button type="button" (click)="pickCity(c)">
                  {{ c.name }} — {{ c.department }}
                </button>
              </li>
            </ul>
            <p class="picked" *ngIf="formCityLabel()">Municipio: {{ formCityLabel() }}</p>
            <label>
              Descripción
              <textarea
                [(ngModel)]="formDesc"
                name="desc"
                rows="4"
                maxlength="2000"
                placeholder="Raza, color, collar, barrio o vereda, cuándo se vio…"
              ></textarea>
            </label>
            <label>
              WhatsApp (opcional)
              <input
                [(ngModel)]="formWa"
                name="wa"
                maxlength="20"
                placeholder="3001234567"
              />
            </label>
            <label>
              Foto (opcional)
              <input type="file" accept="image/*" name="photo" (change)="onPhoto($event)" />
            </label>
            <p class="picked" *ngIf="photoPreview()">Foto lista para publicar.</p>
            <p class="ttl">
              La señal se verá <strong>7 días</strong> y luego se borra. Si sigue perdida o
              encontrada, publícala de nuevo.
            </p>
            <p class="err" *ngIf="formError()">{{ formError() }}</p>
            <p class="ok" *ngIf="ok()">{{ ok() }}</p>
            <div class="manage" *ngIf="manageLink()">
              <p>
                <strong>Guarda este enlace</strong> para marcar que ya apareció / cerrar el aviso:
              </p>
              <a [href]="manageLink()">{{ manageLink() }}</a>
              <button type="button" class="copy" (click)="copyManage()">Copiar enlace</button>
            </div>
            <button type="submit" class="cta" [disabled]="posting()">
              {{ posting() ? 'Publicando…' : 'Publicar señal' }}
            </button>
          </form>

          <p class="err" *ngIf="listError()">{{ listError() }}</p>
          <p class="count" *ngIf="!loading() && !listError()">
            {{ pets().length }} aviso{{ pets().length === 1 ? '' : 's' }}
          </p>
          <ul class="feed" *ngIf="pets().length; else empty">
            <li *ngFor="let p of pets()">
              <article>
                <img
                  *ngIf="p.hasPhoto"
                  class="pet-photo"
                  [src]="api.petPhotoUrl(p.id)"
                  alt="Foto de la mascota"
                />
                <div class="top">
                  <span class="tag" [class.found]="p.kind === 'FOUND'">{{
                    p.kind === 'LOST' ? 'Perdida' : 'Encontrada'
                  }}</span>
                  <span class="sp">{{ speciesLabel(p.species) }}</span>
                </div>
                <p class="desc">{{ p.description }}</p>
                <div class="foot">
                  <span>{{ p.municipality || 'Colombia' }}</span>
                  <span>{{ p.createdAt | date: 'd MMM, HH:mm' }}</span>
                </div>
                <a
                  *ngIf="p.contactWhatsapp"
                  class="wa"
                  [href]="waUrl(p)"
                  target="_blank"
                  rel="noopener"
                  >WhatsApp</a
                >
              </article>
            </li>
          </ul>
          <ng-template #empty>
            <div class="empty" *ngIf="!loading() && !listError()">
              <strong>Aún no hay avisos con esos filtros.</strong>
              <p>Puedes publicar desde cualquier municipio del país.</p>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </section>
  `,
  styles: [
    `
      .page-wrap.wide {
        width: min(900px, calc(100% - 1.5rem));
      }
      .page-wrap.wide.people-wide {
        width: min(1180px, calc(100% - 1.25rem));
      }
      .people-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.65rem;
        align-items: start;
      }
      .people-main {
        grid-column: 1 / -1;
        order: 1;
        min-width: 0;
      }
      .official-kicker {
        grid-column: 1 / -1;
        order: 2;
        margin: 0.4rem 0 0;
        font-weight: 800;
        font-size: 0.82rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .rail {
        display: grid;
        gap: 0.65rem;
        order: 3;
      }
      .rail-card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 0.7rem 0.75rem;
      }
      .rail-card strong {
        font-family: var(--font-display);
        font-size: 0.9rem;
        display: block;
        line-height: 1.25;
      }
      .rail-card p {
        display: none;
        margin: 0.3rem 0 0;
        color: var(--muted);
        font-weight: 500;
        font-size: 0.82rem;
        line-height: 1.4;
      }
      .rail-card a {
        display: inline-block;
        margin-top: 0.4rem;
        font-weight: 800;
        color: var(--teal);
        text-decoration: none;
        font-size: 0.82rem;
      }
      .rail-card p a {
        display: inline;
        margin-top: 0;
      }
      .rail-cta {
        background: var(--coral);
        color: #fff !important;
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
      }
      .rail-card.urgent {
        border-color: rgba(201, 68, 59, 0.25);
        background: linear-gradient(180deg, #fff 0%, #fff6f5 100%);
      }
      @media (min-width: 1024px) {
        .people-layout {
          grid-template-columns: 230px minmax(0, 1fr) 230px;
          gap: 1rem;
        }
        .official-kicker {
          display: none;
        }
        .people-main {
          grid-column: auto;
          order: 0;
        }
        .rail {
          order: 0;
          position: sticky;
          top: calc(var(--nav-h) + 0.75rem);
        }
        .rail-card {
          padding: 0.95rem 1rem;
        }
        .rail-card strong {
          font-size: 1.02rem;
        }
        .rail-card p {
          display: block;
        }
        .rail-card a {
          font-size: 0.86rem;
          margin-top: 0.5rem;
        }
      }
      .tabs {
        display: flex;
        gap: 0.35rem;
        margin-bottom: 1rem;
      }
      .page-wrap.wide.people-wide .tabs {
        width: min(560px, 100%);
        margin-left: auto;
        margin-right: auto;
      }
      .tab {
        flex: 1;
        min-height: 44px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: var(--white);
        font-weight: 800;
        cursor: pointer;
      }
      .tab.on {
        background: var(--ink);
        border-color: var(--ink);
        color: #fff;
      }
      .intro {
        margin: 0 0 1rem;
        font-weight: 600;
        color: var(--muted);
        line-height: 1.45;
      }
      .row-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 0.35rem;
      }
      .row-links a {
        margin-top: 0;
      }
      .panel {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem;
        margin-bottom: 0.9rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.65rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font-weight: 800;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .chip.on {
        background: #f0c84a;
        border-color: transparent;
      }
      .chip.soft.on {
        background: var(--ink);
        color: #fff;
      }
      .cta {
        min-height: 44px;
        border: 0;
        border-radius: 999px;
        background: var(--coral);
        color: #fff;
        font-weight: 800;
        padding: 0 1.1rem;
        cursor: pointer;
      }
      .cta:disabled {
        opacity: 0.6;
      }
      .form label {
        display: grid;
        gap: 0.35rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
      .form textarea,
      .form input,
      .form select {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 0.7rem 0.8rem;
        font: inherit;
      }
      .city-hits {
        list-style: none;
        margin: -0.35rem 0 0.75rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 12px;
        overflow: hidden;
        max-height: 220px;
        overflow-y: auto;
      }
      .city-hits button {
        width: 100%;
        text-align: left;
        border: 0;
        border-bottom: 1px solid var(--line);
        background: var(--cream);
        padding: 0.65rem 0.8rem;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      .city-hits li:last-child button {
        border-bottom: 0;
      }
      .picked {
        margin: 0 0 0.75rem;
        font-weight: 800;
        color: var(--teal-deep);
      }
      .label {
        margin: 0 0 0.4rem;
        font-weight: 800;
        font-size: 0.85rem;
        color: var(--muted);
      }
      .feed {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.7rem;
      }
      .feed article {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1rem;
      }
      .pet-photo {
        width: 100%;
        max-height: 220px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 0.7rem;
        background: #eee;
      }
      .top {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .tag {
        font-size: 0.75rem;
        font-weight: 800;
        padding: 0.25rem 0.55rem;
        border-radius: 999px;
        background: #f8d7d3;
        color: var(--coral-deep);
      }
      .tag.found {
        background: #d8f0ec;
        color: var(--teal-deep);
      }
      .sp {
        font-weight: 700;
        color: var(--muted);
        font-size: 0.9rem;
      }
      .desc {
        margin: 0.55rem 0 0;
        font-weight: 500;
        line-height: 1.45;
      }
      .foot {
        margin-top: 0.55rem;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--muted);
      }
      .wa {
        display: inline-flex;
        margin-top: 0.65rem;
        min-height: 40px;
        align-items: center;
        padding: 0 0.95rem;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        text-decoration: none;
      }
      .count {
        font-weight: 700;
        color: var(--muted);
        margin: 0 0 0.65rem;
      }
      .empty {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.2rem;
      }
      .ttl {
        margin: 0 0 0.75rem;
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--muted);
        line-height: 1.4;
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
      }
      .ok {
        color: var(--teal-deep);
        font-weight: 800;
      }
      .manage {
        margin: 0.5rem 0 0.75rem;
        padding: 0.75rem;
        border-radius: 12px;
        background: #eef7f5;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .manage a {
        display: block;
        margin: 0.35rem 0;
        word-break: break-all;
        color: var(--teal);
        font-weight: 800;
      }
      .manage .copy {
        border: 0;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-weight: 800;
        padding: 0.4rem 0.85rem;
        cursor: pointer;
      }
    `,
  ],
})
export class PerdidosPageComponent implements OnInit {
  readonly api = inject(ApiService);

  tab: 'pets' | 'people' = 'pets';
  kind: PetReportKind | null = null;
  filterCity = '';
  readonly cityChips = CITY_CHIPS;
  readonly cityHits = signal<CityDto[]>([]);
  readonly pets = signal<PetReportDto[]>([]);
  readonly loading = signal(false);
  readonly posting = signal(false);
  readonly showForm = signal(false);
  readonly listError = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly ok = signal<string | null>(null);
  readonly manageLink = signal<string | null>(null);
  readonly formCityLabel = signal('');

  formKind: PetReportKind = 'LOST';
  formSpecies: PetSpecies = 'DOG';
  formCity = '';
  cityQuery = '';
  formDesc = '';
  formWa = '';
  photoBase64: string | null = null;
  readonly photoPreview = signal(false);

  peopleKind: PersonReportKind | null = null;
  peopleFilterCity = '';
  readonly people = signal<PersonReportDto[]>([]);
  readonly pLoading = signal(false);
  readonly pPosting = signal(false);
  readonly showPeopleForm = signal(false);
  readonly pListError = signal<string | null>(null);
  readonly pFormError = signal<string | null>(null);
  readonly pOk = signal<string | null>(null);
  readonly pManageLink = signal<string | null>(null);
  readonly pFormCityLabel = signal('');
  readonly pCityHits = signal<CityDto[]>([]);
  readonly pPhotoPreview = signal(false);
  pFormKind: PersonReportKind = 'LOOKING';
  pFormCity = '';
  pCityQuery = '';
  pFormDesc = '';
  pFormWa = '';
  pPhotoBase64: string | null = null;

  readonly speciesOpts: Array<{ id: PetSpecies; label: string }> = [
    { id: 'DOG', label: 'Perro' },
    { id: 'CAT', label: 'Gato' },
    { id: 'OTHER', label: 'Otra' },
  ];

  ngOnInit(): void {
    this.reload();
  }

  setTab(t: 'pets' | 'people'): void {
    this.tab = t;
    if (t === 'people') this.reloadPeople();
  }

  setKind(k: PetReportKind | null): void {
    this.kind = k;
    this.reload();
  }

  setFilterCity(code: string): void {
    this.filterCity = code;
    this.reload();
  }

  onCityQuery(q: string): void {
    this.formCity = '';
    this.formCityLabel.set('');
    const term = q.trim();
    if (term.length < 2) {
      this.cityHits.set([]);
      return;
    }
    this.api.cities(term).subscribe({
      next: (r) => this.cityHits.set(r.data.slice(0, 12)),
      error: () => this.cityHits.set([]),
    });
  }

  pickCity(c: CityDto): void {
    this.formCity = c.code;
    this.formCityLabel.set(`${c.name} — ${c.department}`);
    this.cityQuery = c.name;
    this.cityHits.set([]);
  }

  speciesLabel(s: PetSpecies): string {
    return this.speciesOpts.find((x) => x.id === s)?.label ?? s;
  }

  waUrl(p: PetReportDto): string {
    const phone = (p.contactWhatsapp ?? '').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hola, vi tu aviso de mascota ${p.kind === 'LOST' ? 'perdida' : 'encontrada'} en Ayuda en Emergencias.`,
    );
    return `https://wa.me/${phone}?text=${text}`;
  }

  reload(): void {
    this.loading.set(true);
    this.listError.set(null);
    this.api
      .pets({
        kind: this.kind ?? undefined,
        cityCode: this.filterCity || undefined,
      })
      .subscribe({
        next: (r) => {
          this.pets.set(r.data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.listError.set('Error al cargar los datos. Intenta de nuevo en un momento.');
        },
      });
  }

  publish(): void {
    this.formError.set(null);
    this.ok.set(null);
    this.manageLink.set(null);
    if (!this.formCity) {
      this.formError.set('Busca y elige un municipio de la lista.');
      return;
    }
    if (this.formDesc.trim().length < 8) {
      this.formError.set('Describe un poco más la mascota.');
      return;
    }
    this.posting.set(true);
    this.api
      .createPet({
        kind: this.formKind,
        species: this.formSpecies,
        description: this.formDesc.trim(),
        cityCode: this.formCity,
        contactWhatsapp: this.formWa.trim() || undefined,
        photoBase64: this.photoBase64 || undefined,
      })
      .subscribe({
        next: (r) => {
          this.posting.set(false);
          this.ok.set('Publicado. Se verá 7 días; luego se borra. Puedes volver a publicarlo.');
          this.manageLink.set(this.api.manageUrl('pet', r.id, r.manageToken));
          this.formDesc = '';
          this.formWa = '';
          this.formCity = '';
          this.formCityLabel.set('');
          this.cityQuery = '';
          this.photoBase64 = null;
          this.photoPreview.set(false);
          this.reload();
        },
        error: (err) => {
          this.posting.set(false);
          const msg =
            err?.error?.message ??
            (Array.isArray(err?.error?.message) ? err.error.message.join(', ') : null);
          this.formError.set(
            typeof msg === 'string' ? msg : 'No se pudo publicar. Revisa los datos.',
          );
        },
      });
  }

  copyManage(): void {
    const link = this.manageLink();
    if (!link) return;
    void navigator.clipboard?.writeText(`${window.location.origin}${link}`);
  }

  async onPhoto(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.photoBase64 = null;
    this.photoPreview.set(false);
    if (!file) return;
    try {
      this.photoBase64 = await compressPetJpeg(file);
      this.photoPreview.set(true);
    } catch {
      this.formError.set('No pudimos leer esa foto. Prueba otra imagen.');
      input.value = '';
    }
  }

  setPeopleKind(k: PersonReportKind | null): void {
    this.peopleKind = k;
    this.reloadPeople();
  }

  setPeopleFilterCity(code: string): void {
    this.peopleFilterCity = code;
    this.reloadPeople();
  }

  onPeopleCityQuery(q: string): void {
    this.pFormCity = '';
    this.pFormCityLabel.set('');
    const term = q.trim();
    if (term.length < 2) {
      this.pCityHits.set([]);
      return;
    }
    this.api.cities(term).subscribe({
      next: (r) => this.pCityHits.set(r.data.slice(0, 12)),
      error: () => this.pCityHits.set([]),
    });
  }

  pickPeopleCity(c: CityDto): void {
    this.pFormCity = c.code;
    this.pFormCityLabel.set(`${c.name} — ${c.department}`);
    this.pCityQuery = c.name;
    this.pCityHits.set([]);
  }

  personKindLabel(k: PersonReportKind): string {
    if (k === 'LOOKING') return 'La busco';
    if (k === 'SEEN') return 'Se vio';
    return 'La encontré';
  }

  personWaUrl(p: PersonReportDto): string {
    const phone = p.contactWhatsapp ?? '';
    const text = encodeURIComponent(
      `Hola, vi tu aviso en Ayuda en Emergencias: ${p.description.slice(0, 140)}`,
    );
    return `https://wa.me/${phone}?text=${text}`;
  }

  reloadPeople(): void {
    this.pLoading.set(true);
    this.pListError.set(null);
    this.api
      .people({
        kind: this.peopleKind ?? undefined,
        cityCode: this.peopleFilterCity || undefined,
      })
      .subscribe({
        next: (r) => {
          this.people.set(r.data);
          this.pLoading.set(false);
        },
        error: () => {
          this.pLoading.set(false);
          this.pListError.set('Error al cargar los datos. Intenta de nuevo en un momento.');
        },
      });
  }

  publishPerson(): void {
    this.pFormError.set(null);
    this.pOk.set(null);
    this.pManageLink.set(null);
    if (!this.pFormCity) {
      this.pFormError.set('Busca y elige un municipio de la lista.');
      return;
    }
    if (this.pFormDesc.trim().length < 8) {
      this.pFormError.set('Describe un poco más (mín. 8 caracteres).');
      return;
    }
    this.pPosting.set(true);
    this.api
      .createPerson({
        kind: this.pFormKind,
        description: this.pFormDesc.trim(),
        cityCode: this.pFormCity,
        contactWhatsapp: this.pFormWa.trim() || undefined,
        photoBase64: this.pPhotoBase64 || undefined,
      })
      .subscribe({
        next: (r) => {
          this.pPosting.set(false);
          this.pOk.set('Publicado. Se verá 7 días; luego se borra. Reporta también en RND/123.');
          this.pManageLink.set(this.api.manageUrl('person', r.id, r.manageToken));
          this.pFormDesc = '';
          this.pFormWa = '';
          this.pFormCity = '';
          this.pFormCityLabel.set('');
          this.pCityQuery = '';
          this.pPhotoBase64 = null;
          this.pPhotoPreview.set(false);
          this.reloadPeople();
        },
        error: (err) => {
          this.pPosting.set(false);
          const msg =
            err?.error?.message ??
            (Array.isArray(err?.error?.message) ? err.error.message.join(', ') : null);
          this.pFormError.set(
            typeof msg === 'string' ? msg : 'No se pudo publicar. Revisa los datos.',
          );
        },
      });
  }

  copyPeopleManage(): void {
    const link = this.pManageLink();
    if (!link) return;
    void navigator.clipboard?.writeText(`${window.location.origin}${link}`);
  }

  async onPeoplePhoto(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.pPhotoBase64 = null;
    this.pPhotoPreview.set(false);
    if (!file) return;
    try {
      this.pPhotoBase64 = await compressPetJpeg(file);
      this.pPhotoPreview.set(true);
    } catch {
      this.pFormError.set('No pudimos leer esa foto. Prueba otra imagen.');
      input.value = '';
    }
  }
}

async function compressPetJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let q = 0.72;
  let data = canvas.toDataURL('image/jpeg', q);
  while (data.length > 240_000 && q > 0.38) {
    q -= 0.08;
    data = canvas.toDataURL('image/jpeg', q);
  }
  return data;
}
