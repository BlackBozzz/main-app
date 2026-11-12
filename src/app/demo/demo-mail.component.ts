import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoApiService, apiError, MailResult } from './demo-api.service';

@Component({
  selector: 'app-demo-mail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './demo-mail.component.html',
})
export class DemoMailComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  readonly active = signal<boolean | null>(null);
  readonly pending = signal(false);
  readonly error = signal('');
  readonly result = signal<MailResult | null>(null);
  target = 'email';
  recipient = '';
  subject = 'Проверка Argent Mail';
  body = 'Привет! Это тестовая рассылка из main-app через ArgentQueue.';
  readonly types = [
    { value: 'email', label: 'Один email' },
    { value: 'emails', label: 'Список email' },
    { value: 'userId', label: 'ID пользователя' },
    { value: 'userIds', label: 'Список ID' },
    { value: 'role', label: 'Код роли' },
    { value: 'roles', label: 'Список ролей' },
    { value: 'all', label: 'Все активные' },
  ];
  readonly example = `mail.queueToRole("ADMIN",
    ArgentMailMessage.text("Тема", "Сообщение"));`;

  ngOnInit(): void {
    this.api.mailStatus().subscribe({
      next: state => this.active.set(state.enabled),
      error: () => this.active.set(false),
    });
  }

  send(): void {
    if (this.pending() || !this.active()) return;
    if ((this.target === 'all' || this.target === 'role' || this.target === 'roles') &&
      !confirm('Подтвердите массовую рассылку: письма будут поставлены в настоящую очередь SMTP.')) return;
    this.pending.set(true);
    this.result.set(null);
    this.error.set('');
    this.api.queueMail(this.target, this.recipient || '-', this.subject, this.body).subscribe({
      next: result => { this.pending.set(false); this.result.set(result); },
      error: error => { this.pending.set(false); this.error.set(apiError(error)); },
    });
  }
}
