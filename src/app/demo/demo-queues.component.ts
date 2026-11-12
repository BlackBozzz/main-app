import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminQueuesApiService, ArgentQueueDto } from '@argent/webapp-common';
import { DemoApiService, apiError } from './demo-api.service';

@Component({
  selector: 'app-demo-queues',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './demo-queues.component.html',
})
export class DemoQueuesComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  private readonly queuesApi = inject(AdminQueuesApiService);
  readonly queue = signal<ArgentQueueDto | null>(null);
  readonly pending = signal(false);
  readonly success = signal('');
  readonly error = signal('');
  count = 10;
  readonly example = `queue.createQueueTask("demo-jobs",
    "demo.fake-task", new FakeTask(id, number));

@ArgentQueueHandler("demo.fake-task")
public void run(FakeTask task) { ... }`;

  ngOnInit(): void { this.refresh(); }

  refresh(): void {
    this.queuesApi.list().subscribe({
      next: list => this.queue.set(list.find(row => row.name === 'demo-jobs') ?? null),
      error: error => this.error.set(apiError(error)),
    });
  }

  create(): void {
    if (!Number.isInteger(this.count) || this.count < 1 || this.count > 100 || this.pending()) return;
    this.pending.set(true);
    this.success.set(''); this.error.set('');
    this.api.queueFakes(this.count).subscribe({
      next: result => {
        this.pending.set(false);
        this.success.set(`Создано ${result.queued} задач в очереди «${result.queueName}»`);
        this.refresh();
      },
      error: error => { this.pending.set(false); this.error.set(apiError(error)); },
    });
  }
}
