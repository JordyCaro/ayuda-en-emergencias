import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { NeedCategory } from '@aee/shared-types';
import { ApiService } from '../api.service';
import { NEED_CATS } from '../plain-labels';

@Component({
  selector: 'aee-need-help-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  template: `
    <section class="page-hero">
      <div class="wrap">
        <p class="kicker">Comunidad</p>
        <h1>Dejar un aviso en el mapa</h1>
        <p class="lead">
          Es un <strong>comentario</strong> en un lugar (“aquí se necesita agua / ayuda con
          escombros…”). <strong>No garantiza</strong> que alguien responda. Nosotros no recibimos
          donaciones.
        </p>
      </div>
    </section>

    <section class="body">
      <div class="wrap narrow">
        <div class="progress" aria-label="Progreso">
          <span [class.on]="step() >= 1">1 · Texto</span>
          <span [class.on]="step() >= 2">2 · Etiqueta</span>
          <span [class.on]="step() >= 3">3 · Lugar</span>
        </div>

        <div class="card" *ngIf="step() === 1">
          <h2>¿Qué se necesita en ese lugar?</h2>
          <textarea
            [(ngModel)]="description"
            maxlength="2000"
            rows="5"
            placeholder="Ejemplo: En esta esquina hacen falta agua potable y manos para remover escombros…"
          ></textarea>
          <button
            type="button"
            class="cta"
            (click)="step.set(2)"
            [disabled]="description.trim().length < 4"
          >
            Continuar
          </button>
        </div>

        <div class="card" *ngIf="step() === 2">
          <h2>Etiqueta (opcional, ayuda a filtrar)</h2>
          <p class="hint">No es un formulario rígido: elige la que más se acerque.</p>
          <div class="chips">
            <button
              type="button"
              class="chip"
              *ngFor="let c of keys"
              [class.on]="category === c"
              (click)="category = c"
            >
              {{ cats[c].short }}
            </button>
          </div>
          <div class="row">
            <button type="button" class="ghost" (click)="step.set(1)">Atrás</button>
            <button type="button" class="cta" (click)="step.set(3)">Continuar</button>
          </div>
        </div>

        <div class="card" *ngIf="step() === 3">
          <h2>¿Dónde queda?</h2>
          <button type="button" class="loc" (click)="useMyLocation()" [disabled]="locating()">
            {{ locating() ? 'Buscando…' : usedGps() ? 'Ubicación lista' : 'Usar mi ubicación' }}
          </button>
          <p class="hint">
            {{ usedGps() ? 'Usaremos tu GPS.' : 'Si no puedes, usamos un punto aproximado.' }}
          </p>
          <div class="summary">
            <strong>{{ cats[category].title }}</strong>
            <p>{{ description }}</p>
          </div>
          <p class="err" *ngIf="error()">{{ error() }}</p>
          <p class="ok" *ngIf="okId()">
            Aviso publicado (sin verificar). Es una señal para la comunidad.
            <a routerLink="/mapa">Ver en Comunidad</a>
          </p>
          <div class="row">
            <button type="button" class="ghost" (click)="step.set(2)" [disabled]="sending()">Atrás</button>
            <button type="button" class="cta" (click)="submit()" [disabled]="!canSubmit() || sending()">
              {{ sending() ? 'Publicando…' : 'Publicar aviso' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-hero {
        background: var(--coral);
        color: #fff;
        padding: 2rem 0 2.2rem;
      }
      .wrap {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
      }
      .wrap.narrow {
        width: min(560px, calc(100% - 1.5rem));
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
        line-height: 1.05;
      }
      .lead {
        margin: 0.7rem 0 0;
        max-width: 36rem;
        font-weight: 600;
        opacity: 0.92;
      }
      .body {
        background: var(--cream);
        padding: 1.5rem 0 3rem;
      }
      .progress {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 1rem;
      }
      .progress span {
        font-size: 0.78rem;
        font-weight: 800;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        background: var(--cream-2);
        color: var(--muted);
      }
      .progress span.on {
        background: var(--ink);
        color: #fff;
      }
      .card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 1.25rem;
        box-shadow: var(--shadow);
      }
      h2 {
        margin: 0 0 0.9rem;
        font-family: var(--font-display);
        font-size: 1.35rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }
      .chip {
        border: 1px solid var(--line);
        background: var(--cream);
        border-radius: 999px;
        padding: 0.7rem 0.95rem;
        font-weight: 800;
        cursor: pointer;
      }
      .chip.on {
        background: var(--ink);
        color: #fff;
        border-color: transparent;
      }
      .hint {
        margin: 0 0 0.85rem;
        color: var(--muted);
        font-weight: 600;
      }
      textarea {
        width: 100%;
        border-radius: 14px;
        border: 1px solid var(--line);
        background: var(--cream);
        padding: 0.9rem;
        font-weight: 600;
        resize: vertical;
        margin-bottom: 1rem;
      }
      .loc {
        width: 100%;
        min-height: var(--tap);
        border: 0;
        border-radius: 14px;
        background: var(--teal);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }
      .summary {
        margin: 1rem 0;
        padding: 0.9rem;
        border-radius: 14px;
        background: var(--sky-band);
      }
      .summary p {
        margin: 0.35rem 0 0;
        font-weight: 600;
      }
      .row {
        display: flex;
        gap: 0.55rem;
        margin-top: 1rem;
      }
      .cta,
      .ghost {
        min-height: var(--tap);
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
        padding: 0 1.2rem;
      }
      .cta {
        flex: 1;
        border: 0;
        background: var(--coral);
        color: #fff;
      }
      .cta:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .ghost {
        border: 1px solid var(--line);
        background: transparent;
        color: var(--muted);
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
      }
      .ok {
        color: var(--teal-deep);
        font-weight: 700;
      }
      .ok a {
        color: var(--teal);
        font-weight: 800;
      }
    `,
  ],
})
export class NeedHelpPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly cats = NEED_CATS;
  readonly keys = Object.keys(NEED_CATS) as NeedCategory[];
  category: NeedCategory = 'OTHER';
  description = '';
  readonly step = signal(1);
  readonly lat = signal<number | null>(null);
  readonly lng = signal<number | null>(null);
  readonly usedGps = signal(false);
  readonly locating = signal(false);
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  readonly okId = signal<string | null>(null);

  ngOnInit(): void {
    this.lat.set(4.711);
    this.lng.set(-74.072);
  }

  canSubmit(): boolean {
    return this.description.trim().length > 3 && this.lat() != null && this.lng() != null;
  }

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.error.set('Este dispositivo no puede compartir ubicación.');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat.set(pos.coords.latitude);
        this.lng.set(pos.coords.longitude);
        this.usedGps.set(true);
        this.locating.set(false);
        this.error.set(null);
      },
      () => {
        this.locating.set(false);
        this.error.set('No pudimos leer el GPS. Puedes publicar con ubicación aproximada.');
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  submit(): void {
    if (!this.canSubmit() || this.lat() == null || this.lng() == null) return;
    this.sending.set(true);
    this.error.set(null);
    this.okId.set(null);
    this.api
      .createNeed({
        category: this.category,
        description: this.description.trim(),
        geometry: { type: 'Point', coordinates: [this.lng()!, this.lat()!] },
      })
      .subscribe({
        next: (need) => {
          this.sending.set(false);
          this.okId.set(need.id);
          this.description = '';
        },
        error: () => {
          this.sending.set(false);
          this.error.set('No se pudo publicar. Intenta otra vez.');
        },
      });
  }
}
