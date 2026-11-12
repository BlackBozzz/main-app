import { Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AttachmentsComponent } from '@argent/webapp-common';

/** Демонстрация именно переиспользуемого <argent-attachments> из webapp-common. */
@Component({
  selector: 'app-demo-files',
  standalone: true,
  imports: [FormsModule, RouterLink, AttachmentsComponent],
  templateUrl: './demo-files.component.html',
})
export class DemoFilesComponent {
  @ViewChild(AttachmentsComponent) private attachments?: AttachmentsComponent;

  orderId: number | null = null;
  readonly activeOrderId = signal<string | null>(null);
  readonly example = `<argent-attachments
  entityType="dict_demo_order"
  [entityId]="activeOrderId()!"
/>

// Универсальный компонент уже умеет:
// список, загрузку, скачивание, удаление и предпросмотр.`;

  load(): void {
    if (!this.orderId || !Number.isSafeInteger(this.orderId) || this.orderId < 1) return;
    const id = String(this.orderId);
    if (this.activeOrderId() === id) {
      this.attachments?.reload();
    } else {
      this.activeOrderId.set(id);
    }
  }
}
