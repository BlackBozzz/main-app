import { Routes } from '@angular/router';
import { ARGENT_AUTH_ROUTES, ARGENT_ROUTES } from '@argent/webapp-common';

// Маршруты входа и админки библиотеки; корень открывает админку
export const routes: Routes = [
  ...ARGENT_AUTH_ROUTES,
  ...ARGENT_ROUTES,
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: '**', redirectTo: 'admin' },
];
