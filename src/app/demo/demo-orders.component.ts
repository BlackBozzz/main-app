import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiError, DemoApiService, DemoOrder, QueryOrder, saveBlob } from './demo-api.service';

@Component({
  selector: 'app-demo-orders',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './demo-orders.component.html',
})
export class DemoOrdersComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  readonly orders = signal<QueryOrder[]>([]);
  readonly created = signal<DemoOrder | null>(null);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  customer = 'Тестовый заказчик';
  total = 1500;
  status = 'REVIEW';
  readonly example = `order.setNumber(numberGenerator.next("ORDER"));
statusTransitions.assertAllowed(
    "ORDER_STATUS", current, next);
// @Audited записывает изменения в журнал`;

  ngOnInit(): void { this.refresh(); }

  refresh(): void {
    this.api.orders(0, 20, 'id', 'desc', '').subscribe({
      next: page => this.orders.set(page.content),
      error: error => this.error.set(apiError(error)),
    });
  }

  create(): void {
    this.saving.set(true); this.error.set(''); this.message.set('');
    this.api.createOrder(this.customer, this.total).subscribe({
      next: order => { this.saving.set(false); this.created.set(order); this.message.set(`Создан заказ ${order.number}`); this.refresh(); },
      error: error => { this.saving.set(false); this.error.set(apiError(error)); },
    });
  }

  change(): void {
    const order = this.created();
    if (!order) return;
    this.saving.set(true); this.error.set(''); this.message.set('');
    this.api.changeOrder(order.id, this.status, order.version).subscribe({
      next: updated => { this.saving.set(false); this.created.set(updated); this.message.set(`Статус изменён: ${updated.status}`); this.refresh(); },
      error: error => { this.saving.set(false); this.error.set(apiError(error)); },
    });
  }

  card(): void {
    const order = this.created();
    if (!order) return;
    this.api.downloadOrderCard(order.id, 'pdf').subscribe({
      next: blob => saveBlob(blob, `order-${order.number}.pdf`),
      error: error => this.error.set(apiError(error)),
    });
  }
}
