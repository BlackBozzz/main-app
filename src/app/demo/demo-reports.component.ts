import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArgentReportFormat, ArgentReportService } from '@argent/webapp-common';
import { apiError, DemoApiService, SaleRow } from './demo-api.service';

@Component({
  selector: 'app-demo-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './demo-reports.component.html',
})
export class DemoReportsComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  readonly reports = inject(ArgentReportService);
  readonly rows = signal<SaleRow[]>([]);
  readonly error = signal('');
  format: ArgentReportFormat = 'pdf';
  readonly example = `// webapp-common: скачивание без диалога
reports.load('/api/demo/reports/static', {
    format: 'xlsx', filename: 'sales'
});

// Просмотр PDF; из диалога можно скачать PDF / XLSX / DOCX
reports.show('/api/demo/reports/table', {
    title: 'Продажи — Jasper Table', filename: 'sales-table'
});`;

  ngOnInit(): void {
    this.api.salesPreview().subscribe({
      next: rows => this.rows.set(rows),
      error: error => this.error.set(apiError(error)),
    });
  }

  load(type: 'static' | 'table'): void {
    this.reports.load(`/api/demo/reports/${type}`, {
      format: this.format,
      filename: `demo-${type}`,
    });
  }

  show(type: 'static' | 'table'): void {
    this.reports.show(`/api/demo/reports/${type}`, {
      title: type === 'static' ? 'Обычный отчёт Jasper' : 'Jasper Table',
      filename: `demo-${type}`,
    });
  }
}
