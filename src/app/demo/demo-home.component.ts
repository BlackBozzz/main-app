import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-demo-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './demo-home.component.html',
})
export class DemoHomeComponent {
  readonly sections = [
    { icon: 'pi pi-envelope', tag: 'Уведомления', title: 'Почтовая рассылка', path: '/demo/mail', note: 'Отправка на email, по ID и ролям', hint: 'ArgentQueuedMailService' },
    { icon: 'pi pi-list-check', tag: 'Фоновые задачи', title: 'Очереди Argent', path: '/demo/queues', note: 'Создать пачку фиктивных заданий', hint: 'ArgentQueueService' },
    { icon: 'pi pi-database', tag: 'Доступ к данным', title: 'QueryDSL', path: '/demo/querydsl', note: 'selectDto + вложенный DTO + Page', hint: 'ArgentQuerydsl' },
    { icon: 'pi pi-file-pdf', tag: 'Документы', title: 'JasperReports', path: '/demo/reports', note: 'PDF, XLSX, DOCX из Java-данных', hint: 'ReportService' },
    { icon: 'pi pi-sitemap', tag: 'Бизнес-процессы', title: 'Заказы и статусы', path: '/demo/orders', note: 'Номера, переходы и аудит', hint: 'NumberGenerator · StatusTransitionService' },
    { icon: 'pi pi-paperclip', tag: 'Файлы', title: 'Вложения', path: '/demo/files', note: 'Загрузка, скачивание и удаление', hint: 'AttachmentService' },
  ];
}
