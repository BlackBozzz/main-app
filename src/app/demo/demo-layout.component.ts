import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ArgentReportDialogComponent, AuthStore } from '@argent/webapp-common';

@Component({
  selector: 'app-demo-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ArgentReportDialogComponent],
  templateUrl: './demo-layout.component.html',
})
export class DemoLayoutComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly user = this.auth.user;
  readonly nav = [
    { path: '/demo', label: 'Обзор', icon: 'pi pi-home', exact: true },
    { path: '/demo/mail', label: 'Почта', icon: 'pi pi-envelope', exact: false },
    { path: '/demo/queues', label: 'Очереди', icon: 'pi pi-list-check', exact: false },
    { path: '/demo/querydsl', label: 'QueryDSL', icon: 'pi pi-database', exact: false },
    { path: '/demo/reports', label: 'JasperReports', icon: 'pi pi-file-pdf', exact: false },
    { path: '/demo/orders', label: 'Статусы и номера', icon: 'pi pi-shopping-bag', exact: false },
    { path: '/demo/files', label: 'Вложения', icon: 'pi pi-paperclip', exact: false },
    { path: '/demo/components', label: 'Компоненты UI', icon: 'pi pi-palette', exact: false },
  ];

  logout(): void {
    this.auth.clear();
    void this.router.navigateByUrl('/login');
  }
}
