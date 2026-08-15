import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import type { ManagePreviewDto, ManageTargetKind } from '@aee/shared-types';
import { ApiService } from '../api.service';

@Component({
  selector: 'aee-cerrar-page',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <section class="page-hero-band">
      <div class="page-wrap">
        <p class="kicker">Tu publicación</p>
        <h1>Cerrar aviso o lugar</h1>
        <p class="lead">
          Sin cuenta: usa el enlace que te dimos al publicar. Así marcas que ya se resolvió o que el
          punto ya no aplica.
        </p>
      </div>
    </section>

    <section class="page-body">
      <div class="page-wrap">
        <p class="err" *ngIf="error()">{{ error() }}</p>
        <p class="ok" *ngIf="done()">Listo. Ya no aparece en los listados públicos.</p>

        <div class="card" *ngIf="preview() && !done()">
          <p class="kind">{{ label(preview()!.kind) }}</p>
          <strong>{{ preview()!.title }}</strong>
          <p class="meta">{{ preview()!.municipality || 'Colombia' }} · {{ preview()!.status }}</p>
          <button type="button" class="cta" [disabled]="closing()" (click)="close()">
            {{ closing() ? 'Cerrando…' : 'Confirmar cierre' }}
          </button>
        </div>

        <p class="hint" *ngIf="!preview() && !error() && !done()">Cargando…</p>
        <p class="hint"><a routerLink="/">Volver al inicio</a></p>
      </div>
    </section>
  `,
  styles: [
    `
      .card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.2rem;
        display: grid;
        gap: 0.55rem;
      }
      .kind {
        margin: 0;
        font-size: 0.8rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--muted);
      }
      .meta {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
      }
      .cta {
        margin-top: 0.5rem;
        min-height: 44px;
        border: 0;
        border-radius: 999px;
        background: var(--coral);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }
      .cta:disabled {
        opacity: 0.6;
      }
      .err {
        color: var(--coral-deep);
        font-weight: 800;
      }
      .ok {
        color: var(--teal-deep);
        font-weight: 800;
      }
      .hint {
        margin-top: 1rem;
        font-weight: 600;
      }
      .hint a {
        color: var(--teal);
        font-weight: 800;
        text-decoration: none;
      }
    `,
  ],
})
export class CerrarPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private kind: ManageTargetKind | null = null;
  private id = '';
  private token = '';

  readonly preview = signal<ManagePreviewDto | null>(null);
  readonly error = signal<string | null>(null);
  readonly done = signal(false);
  readonly closing = signal(false);

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const kind = q.get('kind');
    this.id = q.get('id') ?? '';
    this.token = q.get('token') ?? '';
    if (kind !== 'need' && kind !== 'pet' && kind !== 'place') {
      this.error.set('Enlace incompleto. Usa el que te mostramos al publicar.');
      return;
    }
    this.kind = kind;
    if (!this.id || !this.token) {
      this.error.set('Enlace incompleto. Usa el que te mostramos al publicar.');
      return;
    }
    this.api.managePreview(kind, this.id, this.token).subscribe({
      next: (p) => this.preview.set(p),
      error: () => this.error.set('Enlace inválido o ya cerrado.'),
    });
  }

  label(k: ManageTargetKind): string {
    if (k === 'need') return 'Aviso';
    if (k === 'pet') return 'Mascota';
    return 'Lugar';
  }

  close(): void {
    if (!this.kind) return;
    this.closing.set(true);
    this.error.set(null);
    this.api.manageClose({ kind: this.kind, id: this.id, manageToken: this.token }).subscribe({
      next: () => {
        this.closing.set(false);
        this.done.set(true);
        this.preview.set(null);
      },
      error: () => {
        this.closing.set(false);
        this.error.set('No se pudo cerrar. ¿Enlace inválido?');
      },
    });
  }
}
