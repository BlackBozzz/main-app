import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiError, DemoApiService, Page, QueryOrder } from './demo-api.service';

@Component({
  selector: 'app-demo-querydsl',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './demo-querydsl.component.html',
})
export class DemoQuerydslComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  readonly result = signal<Page<QueryOrder> | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  page = 0;
  size = 10;
  sort = 'id';
  direction = 'desc';
  customer = '';
  readonly example = `var q = QDemoOrder.demoOrder;
var query = factory.select(selectDto(RowDto.class,
    q.id, q.number,
    q.customer.as("details$customer")))
  .from(q);
return ArgentQuerydsl.paginate(query, pageable, sortable);`;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.orders(this.page, this.size, this.sort, this.direction, this.customer).subscribe({
      next: result => { this.loading.set(false); this.result.set(result); },
      error: error => { this.loading.set(false); this.error.set(apiError(error)); },
    });
  }

  search(): void { this.page = 0; this.load(); }
  next(): void { if (!this.result()?.last) { this.page++; this.load(); } }
  previous(): void { if (this.page > 0) { this.page--; this.load(); } }
}
