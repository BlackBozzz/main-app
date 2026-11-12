import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface DemoOrder {
  id: number;
  number: string;
  customer: string;
  status: string;
  total: number;
  createdAt: string;
  version: number;
}

export interface QueryOrder {
  id: number;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  details: { customer: string } | null;
}

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface SaleRow {
  product: string;
  department: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface MailResult {
  selected: number;
  queued: number;
  skipped: number;
  taskIds: string[];
}

export function apiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { detail?: string; message?: string; title?: string } | string | null;
    if (body && typeof body === 'object') {
      return body.detail || body.message || body.title || `Ошибка HTTP ${error.status}`;
    }
    return `Ошибка HTTP ${error.status}. Проверь права пользователя и настройки backend.`;
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

@Injectable({ providedIn: 'root' })
export class DemoApiService {
  private readonly http = inject(HttpClient);

  orders(page: number, size: number, sort: string, direction: string, customer: string) {
    let params = new HttpParams()
      .set('page', page).set('size', size).set('sort', sort).set('direction', direction);
    if (customer.trim()) params = params.set('customer', customer.trim());
    return this.http.get<Page<QueryOrder>>('/api/demo/querydsl/orders', { params });
  }

  createOrder(customer: string, total: number) {
    return this.http.post<DemoOrder>('/api/demo/orders', { customer, total });
  }

  changeOrder(id: number, status: string, version: number) {
    return this.http.post<DemoOrder>(`/api/demo/orders/${id}/status`, { status, version });
  }

  queueFakes(count: number) {
    return this.http.post<{ queued: number; queueName: string; taskIds: string[] }>(
      '/api/demo/queues', { count });
  }

  mailStatus() {
    return this.http.get<{ enabled: boolean }>('/api/demo/mail/status');
  }

  queueMail(target: string, recipient: string, subject: string, body: string) {
    return this.http.post<MailResult>('/api/demo/mail', { target, recipient, subject, body });
  }

  salesPreview() {
    return this.http.get<SaleRow[]>('/api/demo/reports/preview');
  }

  downloadReport(type: 'static' | 'table', format: string) {
    return this.http.get(`/api/demo/reports/${type}`, {
      params: new HttpParams().set('format', format), responseType: 'blob',
    });
  }

  downloadOrderCard(id: number, format: string) {
    return this.http.get(`/api/demo/orders/${id}/card`, {
      params: new HttpParams().set('format', format), responseType: 'blob',
    });
  }

  attachments(orderId: number) {
    return this.http.get<AttachmentInfo[]>('/api/attachments', {
      params: new HttpParams().set('entityType', 'dict_demo_order').set('entityId', String(orderId)),
    });
  }

  uploadAttachment(orderId: number, file: File) {
    const form = new FormData();
    form.append('entityType', 'dict_demo_order');
    form.append('entityId', String(orderId));
    form.append('file', file);
    return this.http.post<AttachmentInfo>('/api/attachments', form);
  }

  downloadAttachment(id: string) {
    return this.http.get(`/api/attachments/${id}`, { responseType: 'blob' });
  }

  deleteAttachment(id: string) {
    return this.http.delete<void>(`/api/attachments/${id}`);
  }
}

export interface AttachmentInfo {
  id: string;
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

/** Blob открывается как обычный файл; запрос проходит через JWT-интерцептор Argent. */
export function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
