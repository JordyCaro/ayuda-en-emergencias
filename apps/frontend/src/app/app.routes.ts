import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { MapPageComponent } from './pages/map-page.component';
import { NeedHelpPageComponent } from './pages/need-help-page.component';
import { SourcesPageComponent } from './pages/sources-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'mapa', component: MapPageComponent },
  { path: 'necesito-ayuda', component: NeedHelpPageComponent },
  { path: 'fuentes', component: SourcesPageComponent },
  { path: '**', redirectTo: '' },
];
