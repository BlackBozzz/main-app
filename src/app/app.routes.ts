import { Routes } from '@angular/router';
import { ARGENT_AUTH_ROUTES, ARGENT_ROUTES, authGuard } from '@argent/webapp-common';

/** Библиотечные маршруты остаются нетронутыми; демостенд — отдельный layout. */
export const routes: Routes = [
  ...ARGENT_AUTH_ROUTES,
  ...ARGENT_ROUTES,
  {
    path: 'demo',
    canActivate: [authGuard],
    loadComponent: () => import('./demo/demo-layout.component').then(m => m.DemoLayoutComponent),
    children: [
      { path: '', title: 'Возможности Argent', loadComponent: () => import('./demo/demo-home.component').then(m => m.DemoHomeComponent) },
      { path: 'mail', title: 'Argent Mail', loadComponent: () => import('./demo/demo-mail.component').then(m => m.DemoMailComponent) },
      { path: 'queues', title: 'Argent Queue', loadComponent: () => import('./demo/demo-queues.component').then(m => m.DemoQueuesComponent) },
      { path: 'querydsl', title: 'Argent QueryDSL', loadComponent: () => import('./demo/demo-querydsl.component').then(m => m.DemoQuerydslComponent) },
      { path: 'reports', title: 'Argent Reports', loadComponent: () => import('./demo/demo-reports.component').then(m => m.DemoReportsComponent) },
      { path: 'orders', title: 'Argent Status & Sequence', loadComponent: () => import('./demo/demo-orders.component').then(m => m.DemoOrdersComponent) },
      { path: 'files', title: 'Argent Attachments', loadComponent: () => import('./demo/demo-files.component').then(m => m.DemoFilesComponent) },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'demo' },
  { path: '**', redirectTo: 'demo' },
];
