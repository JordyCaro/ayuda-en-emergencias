import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'aee-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="nav" [class.scrolled]="scrolled()">
      <div class="nav-inner">
        <a routerLink="/" class="brand" (click)="menuOpen.set(false)">
          <span class="mark" aria-hidden="true"></span>
          <span class="brand-copy">
            <strong>Ayuda en Emergencias</strong>
          </span>
        </a>

        <button
          type="button"
          class="burger"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="site-menu"
          (click)="menuOpen.set(!menuOpen())"
        >
          <span></span><span></span>
          {{ menuOpen() ? 'Cerrar' : 'Menú' }}
        </button>

        <nav id="site-menu" class="links" [class.open]="menuOpen()" aria-label="Principal">
          <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }" (click)="close()">
            Inicio
          </a>
          <a routerLink="/buscar" routerLinkActive="on" (click)="close()">¿Qué necesitas?</a>
          <a routerLink="/ayudar" routerLinkActive="on" (click)="close()">Quiero ayudar</a>
          <a routerLink="/publicar-punto" routerLinkActive="on" (click)="close()">Publicar</a>
          <a routerLink="/fuentes-detalle" routerLinkActive="on" (click)="close()">Fuentes</a>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .nav {
        position: sticky;
        top: 0;
        z-index: 60;
        background: rgba(246, 241, 233, 0.92);
        border-bottom: 1px solid transparent;
        backdrop-filter: blur(12px);
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
      }
      .nav.scrolled {
        border-bottom-color: var(--line);
        box-shadow: 0 8px 30px rgba(16, 35, 63, 0.06);
      }
      .nav-inner {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
        min-height: var(--nav-h);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        text-decoration: none;
        min-width: 0;
      }
      .mark {
        width: 2.15rem;
        height: 2.15rem;
        border-radius: 10px;
        background: linear-gradient(145deg, var(--coral) 0 48%, var(--teal) 52% 100%);
        flex: 0 0 auto;
      }
      .brand-copy {
        display: grid;
        line-height: 1.15;
        min-width: 0;
      }
      .brand-copy strong {
        font-family: var(--font-display);
        font-size: 0.95rem;
        letter-spacing: -0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .burger {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        border: 1px solid var(--line);
        background: var(--white);
        border-radius: 999px;
        min-height: 2.6rem;
        padding: 0 0.9rem;
        font-weight: 800;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .burger span {
        display: block;
        width: 14px;
        height: 2px;
        background: var(--ink);
      }
      .burger span + span {
        margin-top: -6px;
        width: 10px;
      }
      .links {
        display: none;
        position: absolute;
        left: 0.75rem;
        right: 0.75rem;
        top: calc(var(--nav-h) + 0.35rem);
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.65rem;
        border-radius: 18px;
        background: var(--white);
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
      }
      .links.open {
        display: flex;
      }
      .links a {
        text-decoration: none;
        font-weight: 700;
        padding: 0.85rem 0.95rem;
        border-radius: 12px;
        color: var(--ink-soft);
      }
      .links a.on {
        background: var(--sky-band);
        color: var(--ink);
      }
      @media (min-width: 880px) {
        .burger {
          display: none;
        }
        .links {
          display: flex;
          position: static;
          flex-direction: row;
          align-items: center;
          gap: 0.15rem;
          padding: 0;
          border: 0;
          box-shadow: none;
          background: transparent;
        }
        .links a {
          padding: 0.55rem 0.8rem;
          font-size: 0.92rem;
        }
      }
    `,
  ],
})
export class SiteHeaderComponent {
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  close(): void {
    this.menuOpen.set(false);
  }
}
