import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'aee-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="foot">
      <div class="inner">
        <div>
          <strong>Ayuda en Emergencias</strong>
          <p>
            No somos la autoridad de emergencias y <strong>no pedimos ni recibimos donaciones</strong>.
            Solo conectamos información y personas.
          </p>
          <p class="credit">
            Esta es una iniciativa de
            <a href="https://nemco-net.com/" target="_blank" rel="noopener noreferrer">nemco-net</a>
            y
            <a href="https://metnet.co/" target="_blank" rel="noopener noreferrer">metnet</a>:
            aportamos nuestro granito de arena desde la tecnología para conectar a quienes necesitan
            ayuda con quienes pueden darla.
          </p>
        </div>
        <div class="cols">
          <a routerLink="/buscar">¿Qué necesitas?</a>
          <a routerLink="/ayudar">Ayudar</a>
          <a routerLink="/publicar-punto">Publicar lugar</a>
          <a routerLink="/fuentes-detalle">Fuentes</a>
          <a href="tel:123">Urgencia 123</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .foot {
        background: var(--ink);
        color: rgba(255, 252, 247, 0.88);
        padding: 2.4rem 0 2.2rem;
        margin-top: auto;
      }
      .inner {
        width: min(1120px, calc(100% - 1.5rem));
        margin: 0 auto;
        display: grid;
        gap: 1.4rem;
      }
      @media (min-width: 720px) {
        .inner {
          grid-template-columns: 1.4fr 1fr;
          align-items: end;
        }
      }
      strong {
        font-family: var(--font-display);
        font-size: 1.2rem;
        color: #fff;
      }
      p {
        margin: 0.45rem 0 0;
        max-width: 28rem;
        color: rgba(255, 252, 247, 0.68);
        font-weight: 600;
      }
      .credit {
        margin-top: 0.65rem;
        font-size: 0.82rem;
        font-weight: 600;
        color: rgba(255, 252, 247, 0.5);
      }
      .credit a {
        color: rgba(255, 252, 247, 0.78);
        font-weight: 800;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .credit a:hover {
        color: #fff;
      }
      .cols {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.1rem;
      }
      .cols a {
        text-decoration: none;
        font-weight: 800;
        color: #fff;
      }
    `,
  ],
})
export class SiteFooterComponent {}
