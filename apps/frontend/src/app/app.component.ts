import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './layout/site-header.component';
import { SiteFooterComponent } from './layout/site-footer.component';

@Component({
  selector: 'aee-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <div class="shell">
      <aee-site-header />
      <main>
        <router-outlet />
      </main>
      <aee-site-footer />
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
      }
      main {
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {}
