import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { BuscarPageComponent } from './pages/buscar-page.component';
import { AyudarPageComponent } from './pages/ayudar-page.component';
import { PublishPlacePageComponent } from './pages/publish-place-page.component';
import { SourcesPageComponent } from './pages/sources-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'buscar', component: BuscarPageComponent },
  { path: 'necesito-ayuda', redirectTo: 'buscar', pathMatch: 'full' },
  { path: 'ayudar', component: AyudarPageComponent },
  { path: 'quiero-ayudar', redirectTo: 'ayudar', pathMatch: 'full' },
  { path: 'origenes', component: SourcesPageComponent },
  { path: 'oficiales', redirectTo: 'origenes', pathMatch: 'full' },
  { path: 'fuentes', redirectTo: 'origenes', pathMatch: 'full' },
  { path: 'fuentes-detalle', redirectTo: 'origenes', pathMatch: 'full' },
  { path: 'confianza', redirectTo: 'origenes', pathMatch: 'full' },
  { path: 'mapa', redirectTo: 'ayudar', pathMatch: 'full' },
  { path: 'comunidad', redirectTo: 'ayudar', pathMatch: 'full' },
  { path: 'publicar-punto', component: PublishPlacePageComponent },
  { path: '**', redirectTo: '' },
];
