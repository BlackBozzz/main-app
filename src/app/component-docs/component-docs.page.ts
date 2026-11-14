import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ArgentReportService, ArgentTableCellDirective, ArgentTableColumnComponent,
  ArgentTableComponent, ArgentTableToolbarEndDirective, ArgentTableToolbarStartDirective,
  DictionaryRecordTableComponent, DictionaryRecordDialogComponent, GrantsEditorComponent, Grants,
  AttachmentsComponent, AuditLogComponent, DictionaryDynamicFormComponent, ArgentEntitySelectComponent,
  DynamicDictionarySchema, DynamicFieldDefinition, FieldErrorComponent,
} from '@argent/webapp-common';
import { COMPONENT_DOC_GROUPS, COMPONENT_DOCS, COMPONENT_IMPORTS, ComponentDoc, DocGroup } from './component-docs.catalog';

type DocTab = 'demo' | 'api' | 'notes';

function sampleField(
  name: string, label: string, type: string, control: string,
  options: { required?: boolean; help?: string; enumValues?: string[]; enumLabels?: Record<string, string> } = {},
): DynamicFieldDefinition {
  return {
    name, label, type, control, description: null, placeholder: null, help: options.help ?? null,
    order: 0, visible: true, readOnly: false, required: options.required ?? false,
    minLength: null, maxLength: null, minItems: null, maxItems: null,
    minimum: null, maximum: null, pattern: null,
    enumValues: options.enumValues ?? [], enumLabels: options.enumLabels ?? null,
    reference: null, fields: [], validation: [], elementValidation: [],
  };
}

class DemoBusinessDocumentDto {
  title = 'Регламент производства';
  status = 'NEW';
  active = true;
  details = { note: 'Проверить и утвердить' };
}

/** Локальный каталог публичных фронтовых компонентов. Не создаёт бизнес-код и не меняет библиотеку. */
@Component({
  selector: 'app-component-docs',
  standalone: true,
  imports: [
    RouterLink, FormsModule, ReactiveFormsModule, JsonPipe,
    ArgentTableComponent, ArgentTableColumnComponent,
    ArgentTableCellDirective, ArgentTableToolbarStartDirective, ArgentTableToolbarEndDirective,
    AttachmentsComponent, AuditLogComponent, DictionaryDynamicFormComponent, ArgentEntitySelectComponent,
    FieldErrorComponent,
    DictionaryRecordTableComponent, DictionaryRecordDialogComponent, GrantsEditorComponent,
  ],
  templateUrl: './component-docs.page.html',
  styleUrl: './component-docs.page.scss',
})
export class ComponentDocsPage {
  private readonly route = inject(ActivatedRoute);
  readonly reports = inject(ArgentReportService);

  readonly docs = COMPONENT_DOCS;
  readonly groups = COMPONENT_DOC_GROUPS;
  readonly slug = signal('table');
  readonly search = signal('');
  readonly category = signal<DocGroup | 'Все'>('Все');
  readonly tab = signal<DocTab>('demo');
  readonly exampleIndex = signal(0);
  readonly copyStatus = signal<'idle' | 'copied' | 'failed'>('idle');
  readonly doc = computed<ComponentDoc>(() => this.docs.find(item => item.slug === this.slug()) ?? this.docs[0]);
  readonly example = computed(() => this.doc().examples[this.exampleIndex()] ?? this.doc().examples[0]);
  readonly setupCode = computed(() => COMPONENT_IMPORTS[this.doc().slug] ?? "");
  readonly filteredDocs = computed(() => {
    const text = this.search().trim().toLocaleLowerCase('ru');
    return this.docs.filter(item => {
      const groupMatch = this.category() === 'Все' || item.group === this.category();
      const searchMatch = !text || [item.title, item.selector, item.summary, ...item.tags]
        .some(value => value.toLocaleLowerCase('ru').includes(text));
      return groupMatch && searchMatch;
    });
  });

  readonly employees = [
    { id: 101, name: 'Мария Соколова', department: 'Производство', active: true },
    { id: 102, name: 'Иван Петров', department: 'Бухгалтерия', active: true },
    { id: 103, name: 'Анна Смирнова', department: 'Производство', active: false },
    { id: 104, name: 'Алексей Кузнецов', department: 'Логистика', active: true },
  ];
  readonly requests = [
    { id: 1, subject: 'Проверить оборудование', status: 'NEW' },
    { id: 2, subject: 'Утвердить документ', status: 'IN_PROGRESS' },
    { id: 3, subject: 'Оформить заявку', status: 'DONE' },
    { id: 4, subject: 'Сверить остатки', status: 'NEW' },
  ];
  readonly statusOptions = [
    { label: 'Новая', value: 'NEW' },
    { label: 'В работе', value: 'IN_PROGRESS' },
    { label: 'Готово', value: 'DONE' },
  ];
  readonly statusLabels: Readonly<Record<string, string>> = {
    NEW: 'Новая', IN_PROGRESS: 'В работе', DONE: 'Готово',
  };
  readonly statusSeverity = {
    NEW: 'info', IN_PROGRESS: 'warn', DONE: 'success',
  } as const;
  readonly tableSelection = signal('Ничего не выбрано');
  readonly demoDictionaryPage = {
    items: [
      { id: 1, title: 'Инструкция', status: 'NEW', active: true },
      { id: 2, title: 'Регламент', status: 'DONE', active: false },
    ],
    page: 0, size: 10, totalElements: 2, totalPages: 1, first: true, last: true,
  };
  readonly dialogVisible = signal(false);
  readonly grantControl = new FormControl<Grants>({
    tables: { dict_demo_order: ['read'] }, actions: ['admin'],
  }, { nonNullable: true });
  readonly toolbarMessage = signal('');

  entityIdInput = '';
  readonly entityId = signal('');
  readonly emailControl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  readonly sampleForm = new FormGroup({
    title: new FormControl('Тестовый документ', { nonNullable: true, validators: Validators.required }),
    status: new FormControl('NEW', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });
  readonly demoDtoClass = DemoBusinessDocumentDto;
  demoDocument: DemoBusinessDocumentDto = new DemoBusinessDocumentDto();
  demoEmployeeId: string | null = '2';
  demoEmployeeIds: string[] = ['1', '3'];
  readonly demoEmployees = [
    { id: '1', name: 'Анна Смирнова' },
    { id: '2', name: 'Иван Петров' },
    { id: '3', name: 'Мария Соколова' },
  ];
  readonly demoEmployeeOptions = (query: string, page: number, size: number) => {
    const filtered = this.demoEmployees.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    const start = page * size;
    return of({ content: filtered.slice(start, start + size), last: start + size >= filtered.length });
  };
  readonly demoEmployeeRecord = (id: string | number) => of(
    this.demoEmployees.find(item => item.id === String(id)) ?? { id: String(id), name: String(id) },
  );
  readonly businessSchema: DynamicDictionarySchema = {
    code: 'docs', name: 'Документы', idField: 'id', displayField: 'title',
    fields: [
      sampleField('title', 'Название', 'string', 'text', { required: true }),
      sampleField('status', 'Статус', 'enum', 'select', {
        enumValues: ['NEW', 'DONE'], enumLabels: { NEW: 'Новый', DONE: 'Готов' },
      }),
      sampleField('active', 'Активен', 'boolean', 'checkbox'),
      {
        ...sampleField('details', 'Подробности', 'object', 'object'),
        fields: [sampleField('note', 'Примечание', 'string', 'text')],
      },
    ],
  };

  readonly sampleSchema: DynamicDictionarySchema = {
    code: 'example', name: 'Пример формы', idField: 'id', displayField: 'title',
    fields: [
      sampleField('title', 'Название', 'string', 'text', { required: true, help: 'Название документа' }),
      sampleField('status', 'Статус', 'enum', 'select', {
        enumValues: ['NEW', 'DONE'], enumLabels: { NEW: 'Новый', DONE: 'Готов' },
      }),
      sampleField('active', 'Активен', 'boolean', 'checkbox'),
    ],
  };

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const nextSlug = params.get('slug') ?? 'table';
      this.slug.set(this.docs.some(doc => doc.slug === nextSlug) ? nextSlug : 'table');
      this.tab.set('demo');
      this.exampleIndex.set(0);
      this.copyStatus.set('idle');
    });
  }

  docsForGroup(group: DocGroup): readonly ComponentDoc[] {
    return this.filteredDocs().filter(item => item.group === group);
  }

  changeSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  showExample(index: number): void {
    this.exampleIndex.set(index);
    this.copyStatus.set('idle');
  }

  async copySetupCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.setupCode());
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set('failed');
    }
  }

  async copyExample(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.example().code);
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set('failed');
    }
  }

  selectRow(row: unknown): void {
    if (row && typeof row === 'object' && 'name' in row) {
      this.tableSelection.set(String((row as { name: unknown }).name));
    } else {
      this.tableSelection.set('Ничего не выбрано');
    }
  }

  rowName(row: unknown): string {
    return row && typeof row === 'object' && 'name' in row
      ? String((row as { name: unknown }).name) : 'Открыть';
  }

  toolbarAction(action: string): void {
    this.toolbarMessage.set(`Нажата кнопка «${action}». Подключи здесь свой обработчик.`);
  }

  activateEntity(): void {
    this.entityId.set(this.entityIdInput.trim());
  }

  validateEmail(): void {
    this.emailControl.markAsTouched();
    this.emailControl.updateValueAndValidity();
  }

  simulateServerError(): void {
    this.emailControl.setErrors({ server: 'Email уже зарегистрирован' });
    this.emailControl.markAsTouched();
  }

  loadOtherDemoDocument(): void {
    this.demoDocument = {
      title: 'Новый документ', status: 'DONE', active: false,
      details: { note: 'Сведения после GET' },
    };
  }

  validateDemoForm(): void {
    this.sampleForm.markAllAsTouched();
  }

  downloadReport(): void {
    this.reports.load('/api/demo/reports/static', { format: 'xlsx', filename: 'demo-static' });
  }

  previewReport(): void {
    this.reports.show('/api/demo/reports/table', { title: 'Jasper Table — пример', filename: 'demo-table' });
  }
}
