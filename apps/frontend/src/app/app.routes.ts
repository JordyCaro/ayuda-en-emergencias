import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { MapPageComponent } from './pages/map-page.component';
import { NeedHelpPageComponent } from './pages/need-help-page.component';
import { PublishPlacePageComponent } from './pages/publish-place-page.component';
import { SourcesPageComponent } from './pages/sources-page.component';
import { BuscarPageComponent } from './pages/buscar-page.component';
import { AyudarPageComponent } from './pages/ayudar-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'buscar', component: BuscarPageComponent },
  { path: 'ayudar', component: AyudarPageComponent },
  { path: 'mapa', redirectTo: 'ayudar', pathMatch: 'full' },
  { path: 'oficial', component: MapPageComponent },
  { path: 'necesito-ayuda', component: NeedHelpPageComponent },
  { path: 'publicar-punto', component: PublishPlacePageComponent },
  { path: 'fuentes', component: SourcesPageComponent },
  { path: '**', redirectTo: '' },
];
