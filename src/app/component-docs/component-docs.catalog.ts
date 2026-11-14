/**
 * Каталог документирует только публичный API @argent/webapp-common.
 * Примеры сверены с src/public-api.ts, @Input/@Output и сигнатурами сервисов.
 * Это документация существующих компонентов, не генератор бизнес-экранов.
 */
export type DocGroup = 'Таблицы' | 'Данные и формы' | 'Сервисы и интерфейс';

export interface ComponentDocExample {
  title: string;
  description: string;
  language: 'html' | 'typescript';
  code: string;
}

export interface ComponentDocApi {
  name: string;
  kind: 'Вход' | 'Событие' | 'Метод';
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  title: string;
  selector: string;
  group: DocGroup;
  icon: string;
  summary: string;
  tags: readonly string[];
  examples: readonly ComponentDocExample[];
  api: readonly ComponentDocApi[];
  notes: readonly string[];
  requiresBackend?: boolean;
}

export const COMPONENT_DOC_GROUPS: readonly DocGroup[] = [
  'Таблицы', 'Данные и формы', 'Сервисы и интерфейс',
];

export const COMPONENT_DOCS: readonly ComponentDoc[] = [
  {
    slug: 'table', title: 'ArgentTable', selector: '<argent-table>', group: 'Таблицы',
    icon: 'pi pi-table', summary: 'Таблица на AG Grid: локальные строки, серверная пагинация, поиск, сортировка и экспорт.',
    tags: ['AG Grid', 'таблица', 'пагинация', 'фильтры', 'экспорт'],
    examples: [
      {
        title: 'Локальные данные', description: 'Без backend: поиск и сортировка по массиву, выбор строки.', language: 'html',
        code: `<argent-table
    title="Сотрудники"
    [rows]="employees"
    [lazy]="false"
    [showExport]="false"
    [height]="'290px'"
    (selectionChange)="selected = $event"
>
    <argent-table-column field="id" header="ID" type="number" [sortable]="true" />
    <argent-table-column field="name" header="ФИО" [sortable]="true" />
    <argent-table-column field="department" header="Отдел" />
</argent-table>`,
      },
      {
        title: 'Фильтры и статусы', description: 'Типизированные колонки и выпадающий фильтр; статус оформляется бейджем.', language: 'html',
        code: `<argent-table
    title="Заявки"
    [rows]="requests"
    [lazy]="false"
    [showExport]="false"
    [showFilters]="true"
    [height]="'290px'"
>
    <argent-table-column field="id" header="№" type="number" [sortable]="true" />
    <argent-table-column field="subject" header="Тема" [filterable]="true" />
    <argent-table-column field="status" header="Статус" type="status"
        [filterable]="true"
        [filterOptions]="statusOptions"
        [labelMap]="statusLabels"
        [severityMap]="statusSeverity" />
</argent-table>`,
      },
      {
        title: 'Серверная пагинация', description: 'Событие queryChange содержит page, size, search, filters и sort.', language: 'html',
        code: `<argent-table
    title="Документы"
    [rows]="page.items"
    [lazy]="true"
    [loading]="loading"
    [pageSize]="20"
    [totalRecords]="page.totalElements"
    (queryChange)="loadPage($event)"
>
    <argent-table-column field="id" header="ID" [sortable]="true" />
    <argent-table-column field="title" header="Название" [filterable]="true" />
</argent-table>

// loadPage(query: ArgentTableQuery): void {
//   // передай query.page, query.size, query.filters, query.sort в REST
// }`,
      },
    ],
    api: [
      { name: 'title', kind: 'Вход', type: 'string', defaultValue: '', description: 'Заголовок над таблицей.' },
      { name: 'loading', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Признак загрузки данных.' },
      { name: 'selected', kind: 'Вход', type: 'unknown | null', defaultValue: 'null', description: 'Текущая выбранная строка.' },
      { name: 'search', kind: 'Вход', type: 'string', defaultValue: '', description: 'Текущее поисковое выражение.' },
      { name: 'filters', kind: 'Вход', type: 'Readonly<Record<string, ArgentTableFilterValue>>', defaultValue: '{}', description: 'Активные фильтры полей.' },
      { name: 'sort', kind: 'Вход', type: 'ArgentTableQuery.sort', defaultValue: 'null', description: 'Активная сортировка.' },
      { name: 'showRefresh', kind: 'Вход', type: 'boolean', defaultValue: 'true', description: 'Показывать кнопку обновления.' },
      { name: 'exportDisabled / importDisabled', kind: 'Вход', type: 'boolean', defaultValue: 'false / false', description: 'Заблокировать кнопки экспорта и импорта.' },
      { name: 'exportFormats', kind: 'Вход', type: "('xlsx' | 'csv')[]", defaultValue: '[xlsx, csv]', description: 'Форматы стандартного экспорта.' },
      { name: 'exportScope', kind: 'Вход', type: "'filtered' | 'selected' | 'page'", defaultValue: 'page', description: 'Какие строки экспортировать.' },
      { name: 'emptyMessage', kind: 'Вход', type: 'string', defaultValue: 'Нет данных', description: 'Текст пустой таблицы.' },
      { name: 'rows', kind: 'Вход', type: 'unknown[]', defaultValue: '[]', description: 'Строки для отображения.' },
      { name: 'lazy', kind: 'Вход', type: 'boolean', defaultValue: 'true', description: 'Серверная загрузка блоков через queryChange.' },
      { name: 'rowKey', kind: 'Вход', type: 'string', defaultValue: 'id', description: 'Уникальный ключ строки; нужен стабильный ID.' },
      { name: 'pageIndex / pageSize', kind: 'Вход', type: 'number', defaultValue: '0 / 20', description: 'Номер страницы (с нуля) и размер блока.' },
      { name: 'totalRecords', kind: 'Вход', type: 'number', defaultValue: '0', description: 'Общее количество строк в серверном режиме.' },
      { name: 'height', kind: 'Вход', type: 'string', defaultValue: '540px', description: 'Высота виртуализированной таблицы.' },
      { name: 'selectionMode', kind: 'Вход', type: "'none' | 'single' | 'multiple'", defaultValue: 'single', description: 'Режим выбора строк.' },
      { name: 'showSearch / showFilters', kind: 'Вход', type: 'boolean', defaultValue: 'true / true', description: 'Отображение поиска и фильтров колонок.' },
      { name: 'showExport / showImport', kind: 'Вход', type: 'boolean', defaultValue: 'true / false', description: 'Кнопки выгрузки и импорта.' },
      { name: 'exportMode', kind: 'Вход', type: "'page' | 'external'", defaultValue: 'page', description: 'Экспорт страницы либо обработка через exportRequested.' },
      { name: 'queryChange', kind: 'Событие', type: 'ArgentTableQuery', defaultValue: '—', description: 'Запрос страницы/фильтрации/сортировки.' },
      { name: 'selectionChange', kind: 'Событие', type: 'unknown', defaultValue: '—', description: 'Выбранная строка.' },
      { name: 'refreshRequested', kind: 'Событие', type: 'void', defaultValue: '—', description: 'Нажатие кнопки обновления.' },
      { name: 'exportRequested', kind: 'Событие', type: 'ArgentTableExportRequest', defaultValue: '—', description: 'Запрос внешнего экспорта.' },
      { name: 'importRequested', kind: 'Событие', type: 'void', defaultValue: '—', description: 'Запрос импорта.' },
      { name: 'rowDoubleClick', kind: 'Событие', type: 'unknown', defaultValue: '—', description: 'Двойное нажатие на строку.' },
      { name: 'refreshRows()', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Принудительно обновить строки таблицы, включая кэш AG Grid.' },
    ],
    notes: [
      'Для локального массива обязательно указывай [lazy]="false". По умолчанию таблица работает в режиме серверных блоков.',
      'При серверной загрузке фильтруй и сортируй на backend ДО пагинации, иначе пользователь увидит неполные результаты.',
      'В Angular HTML соблюдай порядок атрибутов AtomSkills: директивы, стили, HTML, односторонние, двусторонние, события.',
    ],
  },
  {
    slug: 'columns', title: 'Колонки и шаблоны ячеек', selector: '<argent-table-column>', group: 'Таблицы',
    icon: 'pi pi-list', summary: 'Типы колонок, отображение статусов, чисел, связей и пользовательских действий.',
    tags: ['ArgentTableColumn', 'ячейки', 'бэйдж', 'custom', 'действия'],
    examples: [
      {
        title: 'Типы колонок', description: 'Строка, число, дата, флаг и статус с русскими названиями.', language: 'html',
        code: `<argent-table [rows]="rows" [lazy]="false" [showExport]="false">
    <argent-table-column field="name" header="Название" type="string" />
    <argent-table-column field="amount" header="Сумма" type="currency"
        currency="RUB" />
    <argent-table-column field="active" header="Активен" type="boolean" />
    <argent-table-column field="status" header="Статус" type="status"
        [labelMap]="statusLabels" [severityMap]="statusSeverity" />
</argent-table>`,
      },
      {
        title: 'Свой шаблон ячейки', description: 'Внутри колонки можно определить шаблон с let-row.', language: 'html',
        code: `<argent-table [rows]="rows" [lazy]="false" [showExport]="false">
    <argent-table-column field="name" header="Название" />
    <argent-table-column field="action" header="Действия" type="custom">
        <ng-template argentTableCell let-row>
            <button type="button" (click)="open(row)">Открыть</button>
        </ng-template>
    </argent-table-column>
</argent-table>`,
      },
    ],
    api: [
      { name: 'field', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'Ключ данных строки.' },
      { name: 'header', kind: 'Вход', type: 'string', defaultValue: 'field', description: 'Заголовок столбца.' },
      { name: 'type', kind: 'Вход', type: 'ArgentTableColumnType', defaultValue: 'string', description: 'string, text, number, decimal, currency, boolean, date, datetime, enum, status, badge, relation, file, actions, custom и другие.' },
      { name: 'width / minWidth', kind: 'Вход', type: 'string', defaultValue: '—', description: 'Ширина и минимальная ширина.' },
      { name: 'sortable / filterable', kind: 'Вход', type: 'boolean', defaultValue: 'false / false', description: 'Разрешение сортировки и фильтрации.' },
      { name: 'visible / frozen', kind: 'Вход', type: 'boolean', defaultValue: 'true / false', description: 'Видимость и закрепление колонки.' },
      { name: 'labelMap / severityMap', kind: 'Вход', type: 'Record<string, …>', defaultValue: '—', description: 'Тексты и цвета статусов.' },
      { name: 'filterOptions', kind: 'Вход', type: 'ArgentTableFilterOption[]', defaultValue: '—', description: 'Варианты выпадающего фильтра.' },
      { name: 'align', kind: 'Вход', type: "'left' | 'center' | 'right'", defaultValue: 'left', description: 'Выравнивание содержимого.' },
      { name: 'truncate', kind: 'Вход', type: 'boolean', defaultValue: 'true', description: 'Обрезать длинный текст.' },
      { name: 'emptyValue', kind: 'Вход', type: 'string', defaultValue: '—', description: 'Подпись пустого значения.' },
      { name: 'format', kind: 'Вход', type: 'string', defaultValue: '—', description: 'Дополнительный формат отображения.' },
      { name: 'currency / locale', kind: 'Вход', type: 'string', defaultValue: 'RUB / ru-RU', description: 'Валюта и локаль для форматирования.' },
      { name: 'decimalPlaces', kind: 'Вход', type: 'number', defaultValue: '—', description: 'Количество знаков после запятой.' },
      { name: 'displayField / separator', kind: 'Вход', type: 'string', defaultValue: '— / , ', description: 'Поле представления связанного объекта и разделитель списка.' },
      { name: 'filterType', kind: 'Вход', type: 'string', defaultValue: '—', description: 'Тип данных фильтра, полученный из DTO.' },
      { name: 'argentTableCell', kind: 'Вход', type: 'ng-template', defaultValue: '—', description: 'Шаблон ячейки; в let-row приходит исходная строка.' },
    ],
    notes: ['Шаблон пользовательской ячейки не должен изменять исходные данные при отрисовке.', 'Сортировка и фильтры работают с полями, которые возвращает backend, а не с текстом заголовка.'],
  },
  {
    slug: 'toolbar', title: 'Панель инструментов таблицы', selector: 'argentTableToolbarStart / End', group: 'Таблицы',
    icon: 'pi pi-sliders-h', summary: 'Добавляй свои кнопки рядом со стандартными действиями ArgentTable.',
    tags: ['toolbar', 'ng-template', 'кнопки'],
    examples: [{ title: 'Пользовательские кнопки', description: 'Кнопки живут в шаблоне, таблица рендерит их в своей панели.', language: 'html', code: `<argent-table title="Сотрудники" [rows]="employees" [lazy]="false"
    [showExport]="false" (refreshRequested)="reload()">
    <ng-template argentTableToolbarStart>
        <button type="button" (click)="add()">Добавить</button>
    </ng-template>
    <ng-template argentTableToolbarEnd>
        <button type="button" (click)="help()">Помощь</button>
    </ng-template>
    <argent-table-column field="name" header="Сотрудник" />
</argent-table>` }],
    api: [
      { name: 'argentTableToolbarStart', kind: 'Вход', type: 'ng-template', defaultValue: '—', description: 'Шаблон слева от стандартных действий таблицы.' },
      { name: 'argentTableToolbarEnd', kind: 'Вход', type: 'ng-template', defaultValue: '—', description: 'Шаблон справа от стандартных действий.' },
      { name: 'refreshRequested', kind: 'Событие', type: 'void', defaultValue: '—', description: 'Событие нажатия стандартной кнопки обновления.' },
    ],
    notes: ['Для кнопки «Добавить» используй toolbarStart: она сохранится при перестройке колонок AG Grid.', 'Описания колонок должны быть вложены внутрь <argent-table>.'],
  },
  {
    slug: 'attachments', title: 'Вложения', selector: '<argent-attachments>', group: 'Данные и формы',
    icon: 'pi pi-paperclip', summary: 'Список, загрузка, скачивание, удаление и безопасный предпросмотр файлов записи.',
    tags: ['файлы', 'PDF', 'просмотр', 'загрузка'], requiresBackend: true,
    examples: [
      { title: 'Загрузка и просмотр', description: 'Привязка к существующей записи по типу и ID.', language: 'html', code: `<argent-attachments
    entityType="dict_demo_order"
    [entityId]="orderId"
/>

// id должен принадлежать существующей записи;
// сервер проверяет права на таблицу.` },
      { title: 'Только просмотр', description: 'Запрет загрузки и удаления на уровне UI; серверные права всё равно обязательны.', language: 'html', code: `<argent-attachments
    entityType="dict_demo_order"
    [entityId]="orderId"
    [readonly]="true"
/>` },
    ],
    api: [
      { name: 'entityType', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'Код таблицы-владельца, на которую проверяются гранты.' },
      { name: 'entityId', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'ID записи-владельца.' },
      { name: 'readonly', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Отключить изменение файлов на клиенте.' },
      { name: 'reload()', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Перечитать список файлов через API.' },
      { name: 'canPreview(item)', kind: 'Метод', type: 'boolean', defaultValue: '—', description: 'Определить доступность предпросмотра файла.' },
      { name: 'showPreview(item)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Открыть файл в диалоге.' },
      { name: 'closePreview()', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Закрыть предпросмотр.' },
      { name: 'download(item)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Скачать выбранный файл.' },
    ],
    notes: ['Требует backend, авторизации и права table:<entityType>:read.', 'Предпросмотр поддерживается для PDF, изображений, текста, аудио и видео; неподдерживаемые форматы скачиваются.', 'Не выставляй прямые публичные URL файлов: компонент загружает их через авторизованный REST.'],
  },
  {
    slug: 'reports', title: 'JasperReports: скачать и показать', selector: 'ArgentReportService', group: 'Сервисы и интерфейс',
    icon: 'pi pi-file-pdf', summary: 'load() скачивает файл, show() открывает PDF в диалоге с выгрузкой PDF/XLSX/DOCX.',
    tags: ['Jasper', 'PDF', 'XLSX', 'DOCX', 'load', 'show'], requiresBackend: true,
    examples: [
      { title: 'load() — скачать', description: 'HTTP GET с параметром format; можно передавать параметры отчёта.', language: 'typescript', code: `private readonly reports = inject(ArgentReportService);

loadReport(): void {
    this.reports.load('/api/demo/reports/static', {
        format: 'xlsx',
        filename: 'sales',
        params: { year: 2026, onlyActive: true },
    });
}` },
      { title: 'show() — предпросмотр', description: 'Открывает PDF; внутри окна доступны кнопки PDF, Excel и Word.', language: 'typescript', code: `private readonly reports = inject(ArgentReportService);

showReport(): void {
    this.reports.show('/api/demo/reports/table', {
        title: 'Продажи',
        filename: 'sales-table',
        params: { year: 2026 },
    });
}

// Один раз в layout приложения:
// <argent-report-dialog />` },
    ],
    api: [
      { name: 'load(url, options?)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Сразу скачать PDF, XLSX или DOCX.' },
      { name: 'show(url, options?)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Открыть диалог предпросмотра PDF.' },
      { name: 'fetch(url, format, params?)', kind: 'Метод', type: 'Observable<Blob>', defaultValue: '—', description: 'Получить Blob без автоматического скачивания.' },
      { name: 'close()', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Закрыть диалог просмотра.' },
      { name: 'downloadFromPreview(format)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Скачать PDF/XLSX/DOCX из открытого диалога.' },
      { name: 'previewLoading / downloading', kind: 'Метод', type: 'Signal<boolean>', defaultValue: 'false', description: 'Сигналы загрузки предпросмотра и скачивания.' },
      { name: 'error', kind: 'Метод', type: 'Signal<string>', defaultValue: '', description: 'Последняя ошибка запроса отчёта.' },
      { name: 'format', kind: 'Вход', type: "'pdf' | 'xlsx' | 'docx'", defaultValue: 'pdf', description: 'Формат скачивания.' },
      { name: 'params', kind: 'Вход', type: 'Record<string, string | number | boolean>', defaultValue: '—', description: 'Query-параметры запроса.' },
      { name: 'title / filename', kind: 'Вход', type: 'string', defaultValue: 'заголовок / report', description: 'Заголовок диалога и имя файла.' },
    ],
    notes: ['Для show() обязательно добавь <argent-report-dialog /> один раз в корневой layout.', 'Поддерживаются только GET-параметры простых типов; для сложного тела запроса потребуется отдельная реализация.', 'Демонстрационный backend поддерживает /api/demo/reports/static и /api/demo/reports/table без обязательных параметров.'],
  },
  {
    slug: 'audit', title: 'Журнал изменений записи', selector: '<argent-audit-log>', group: 'Данные и формы',
    icon: 'pi pi-history', summary: 'История изменений конкретной записи с серверной пагинацией и проверкой доступа.',
    tags: ['аудит', 'история', 'изменения'], requiresBackend: true,
    examples: [{ title: 'Аудит заказа', description: 'История изменений привязана к типу таблицы и ID записи.', language: 'html', code: `<argent-audit-log
    entityType="dict_demo_order"
    [entityId]="orderId"
    [pageSize]="10"
/>

// Для просмотра нужны права table:dict_demo_order:read
// или действие admin.` }],
    api: [
      { name: 'entityType', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'Код таблицы, изменения которой нужно показать.' },
      { name: 'entityId', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'Идентификатор записи.' },
      { name: 'pageSize', kind: 'Вход', type: 'number', defaultValue: '20', description: 'Количество записей на странице журнала.' },
    ],
    notes: ['Для проверки создай или измени заказ, затем открой его аудит.', 'Компонент не заменяет глобальную страницу /admin/audit, а показывает историю одной записи.'],
  },
  {
    slug: 'dynamic-form', title: 'Типизированная динамическая форма', selector: '<argent-dictionary-dynamic-form>', group: 'Данные и формы',
    icon: 'pi pi-pencil', summary: 'Форма сама создаёт FormGroup, возвращает DTO через [(dto)] и поддерживает вложенные объекты и отношения.',
    tags: ['форма', 'DTO', 'двусторонняя привязка', 'вложенные DTO', 'валидация'],
    examples: [
      { title: 'DTO без editor', description: 'Форма сама создаёт FormGroup. Встроенный пример с вложенным DTO и выбором ответственного.', language: 'html', code: `<div class="argent-form">
    <argent-dictionary-dynamic-form
        #documentForm
        [schema]="businessSchema"
        [dtoClass]="DemoBusinessDocumentDto"
        [(dto)]="document"
    />
    <div class="argent-form__actions">
        <button pButton type="button"
            [disabled]="documentForm.invalid || documentForm.pending || saving"
            (click)="save()">Сохранить</button>
    </div>
</div>

// TS: document: DemoBusinessDocumentDto = new DemoBusinessDocumentDto();
// save() { this.http.post('/api/documents', this.document).subscribe(...); }
// Библиотека НЕ отправляет запросы сама.` },
      { title: 'Старый API', description: 'Для CRUD-диалогов можно продолжать передавать собственный FormGroup.', language: 'html', code: `<argent-dictionary-dynamic-form
    [schema]="schema"
    [form]="form"
/>

// Старое API forms.create(schema) / forms.toDto(schema, form) сохранено.` },
      { title: 'Подстановка DTO после GET', description: 'При замене переменной DTO компонент обновляет значения и массивы автоматически.', language: 'typescript', code: `document: DemoBusinessDocumentDto = new DemoBusinessDocumentDto();

load(id: string): void {
    this.http.get<DemoBusinessDocumentDto>('/api/documents/' + id)
        .subscribe(dto => this.document = dto);
}

// Шаблон: [(dto)]="document"; менять FormGroup вручную не нужно.
// #documentForm.getDto() — актуальный DTO, даже до следующего CD.` },
    ],
    api: [
      { name: 'schema', kind: 'Вход', type: 'DynamicDictionarySchema', defaultValue: 'обязательно', description: 'Описание полей и вложенных структур.' },
      { name: 'dto', kind: 'Вход', type: 'T | null', defaultValue: 'null', description: 'Данные для редактирования, поддерживает замену после GET.' },
      { name: 'dtoChange', kind: 'Событие', type: 'T', defaultValue: '—', description: 'Типизированный DTO при изменении полей: [(dto)].' },
      { name: 'dtoClass', kind: 'Вход', type: 'new () => T | null', defaultValue: 'null', description: 'Необязательная runtime-проверка имён полей класса.' },
      { name: 'form', kind: 'Вход', type: 'FormGroup | null', defaultValue: 'null', description: 'Необязательная передача внешнего FormGroup для старых экранов.' },
      { name: 'getDto()', kind: 'Метод', type: 'T', defaultValue: '—', description: 'Сразу получить сериализованное значение.' },
      { name: 'invalid / pending / dirty / touched', kind: 'Метод', type: 'boolean', defaultValue: '—', description: 'Состояние формы для кнопок.' },
      { name: 'markAllAsTouched() / reset(value?)', kind: 'Метод', type: 'void', defaultValue: '—', description: 'Валидация и очистка/замена значения.' },
      { name: 'createTyped<T>() / bindTyped<T>()', kind: 'Метод', type: 'старое API сервиса', defaultValue: '—', description: 'Сохранены для внешних Reactive Forms.' },
    ],
    notes: ['Никакого editor: компонент сам создаёт FormGroup и выдаёт DTO через [(dto)].', 'Точность decimal, вложенные объекты и коллекции наследуют сериализацию DynamicDictionaryFormService.', 'Проверяй invalid и pending до сохранения; итоговый DTO обязательно валидирует backend.', 'Компонент не делает POST/PUT: собственная бизнес-логика остаётся в приложении.'],
  },
  {
    slug: 'entity-select', title: 'Выбор произвольной сущности', selector: '<argent-entity-select>', group: 'Данные и формы',
    icon: 'pi pi-users', summary: 'Поиск по любому REST API: один ID или массив ID, загрузка названий по ID и постраничный поиск.',
    tags: ['relation', 'select', 'autocomplete', 'CVA', 'many-to-many', 'список сотрудников'],
    examples: [
      { title: 'Одиночный выбор', description: 'Связь с одним сотрудником; FormControl хранит только ID.', language: 'html', code: `<argent-entity-select
    label="Ответственный"
    endpoint="/api/employees"
    valueField="id"
    labelField="profile.fullName"
    placeholder="Начните вводить сотрудника"
    [formControl]="form.controls.responsibleId"
/>

// GET /api/employees?search=...&page=0&size=20
// GET /api/employees/{id} (для подписи выбранного ID)
// Свойство responsibleId: string | null.` },
      { title: 'Множественный выбор', description: 'Выбор исполнителей; в DTO передаётся только массив их ID.', language: 'html', code: `<argent-entity-select
    label="Исполнители"
    endpoint="/api/employees"
    labelField="profile.fullName"
    [multiple]="true"
    [formControl]="form.controls.participantIds"
/>

// FormControl<string[]> (или числа, если числовой ID).` },
      { title: 'Нестандартный backend API', description: 'Можно передать загрузчики для поиска и разрешения записи по ID.', language: 'typescript', code: `readonly searchEmployees = (query: string, page: number, size: number) =>
    this.http.get('/api/staff/find', { params: { q: query, page, size } });
readonly getEmployee = (id: string | number) =>
    this.http.get('/api/staff/lookup/' + encodeURIComponent(String(id)));

// <argent-entity-select [optionsLoader]="searchEmployees"
//    [recordLoader]="getEmployee" valueField="id" labelField="fullName"
//    [formControl]="form.controls.employeeId" />` },
    ],
    api: [
      { name: 'endpoint', kind: 'Вход', type: 'string', defaultValue: '—', description: 'GET поиска записей, если не задан optionsLoader.' },
      { name: 'valueField / labelField', kind: 'Вход', type: 'string', defaultValue: 'id / name', description: 'Поля ID и отображаемого имени; поддерживаются вложенные пути.' },
      { name: 'multiple', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Один ID либо массив ID.' },
      { name: 'searchParam / pageParam / sizeParam', kind: 'Вход', type: 'string', defaultValue: 'search/page/size', description: 'Имена query-параметров.' },
      { name: 'pageSize', kind: 'Вход', type: 'number', defaultValue: '20', description: 'Количество вариантов на страницу, кнопка «Показать ещё».' },
      { name: 'resolveEndpoint', kind: 'Вход', type: 'string | null', defaultValue: 'endpoint/{id}', description: 'GET выбранной записи по ID; null отключает загрузку подписи.' },
      { name: 'optionsLoader / recordLoader', kind: 'Вход', type: 'функции Observable', defaultValue: 'null', description: 'Переопределение запросов для нестандартного API.' },
      { name: 'formControl / formControlName', kind: 'Вход', type: 'Angular Forms CVA', defaultValue: '—', description: 'Идентификаторы через Reactive Forms; управление disabled и touched.' },
    ],
    notes: ['Для списка поддерживаются Spring Page.content, DynamicPage.items и обычный массив.', 'Для уже выбранного ID нужен GET одной записи либо recordLoader — иначе в поле отображается сам ID.', 'Разрешения доступа, фильтрация и сортировка проверяются на backend.'],
  },
  {
    slug: 'errors', title: 'Ошибки полей', selector: '<argent-field-error>', group: 'Данные и формы',
    icon: 'pi pi-exclamation-circle', summary: 'Русские сообщения Validators и ошибок сервера прямо под Angular FormControl.',
    tags: ['ошибка', 'валидация', 'FormControl', 'ProblemDetail'],
    examples: [
      { title: 'Required и email', description: 'Нажми «Проверить», чтобы показать сообщение для touched-поля.', language: 'html', code: `<input type="email" [formControl]="emailControl" />
<argent-field-error [control]="emailControl" />

// TS
emailControl = new FormControl('', [Validators.required, Validators.email]);
check(): void { this.emailControl.markAsTouched(); }` },
      { title: 'Ошибка, пришедшая с backend', description: 'Серверные ошибки имеют ключ server; компонент покажет их первыми.', language: 'typescript', code: `this.emailControl.setErrors({ server: 'Email уже зарегистрирован' });
this.emailControl.markAsTouched();

// Для реального API используй applyServerErrors(...)
// из @argent/webapp-common.` },
    ],
    api: [
      { name: 'control', kind: 'Вход', type: 'AbstractControl', defaultValue: 'обязательно', description: 'Контрол Reactive Forms, ошибки которого нужно показать.' },
    ],
    notes: ['Сообщение отображается после touched; до этого ошибка не отвлекает пользователя.', 'Поддерживаются required, minlength, maxlength, min, max, email и server.'],
  },
  {
    slug: 'admin', title: 'Готовая админка и маршруты', selector: 'ARGENT_ROUTES', group: 'Сервисы и интерфейс',
    icon: 'pi pi-desktop', summary: 'Готовые страницы пользователей, ролей, данных, очередей, аудита и документации API.',
    tags: ['админка', 'роуты', 'меню', 'доступ'],
    examples: [{ title: 'Подключение маршрутов', description: 'Не копируй страницы админки в приложение — подключи готовые маршруты.', language: 'typescript', code: `import { Routes } from '@angular/router';
import { ARGENT_AUTH_ROUTES, ARGENT_ROUTES } from '@argent/webapp-common';

export const routes: Routes = [
    ...ARGENT_AUTH_ROUTES,
    ...ARGENT_ROUTES,
    { path: '', pathMatch: 'full', redirectTo: 'admin' },
];` }],
    api: [
      { name: 'ARGENT_AUTH_ROUTES', kind: 'Вход', type: 'Routes', defaultValue: '—', description: 'Библиотечные маршруты авторизации.' },
      { name: 'ARGENT_ROUTES', kind: 'Вход', type: 'Routes', defaultValue: '—', description: 'Маршруты административных страниц.' },
      { name: 'authGuard', kind: 'Метод', type: 'CanActivateFn', defaultValue: '—', description: 'Защита маршрутов авторизованного пользователя.' },
    ],
    notes: ['Обычно доступ к /admin ограничен правами пользователя и проверяется backend.', 'Раздел «Данные» и документация Swagger уже входят в существующие библиотечные маршруты.'],
  },
  {
    slug: 'dictionary-table', title: 'Таблица справочника', selector: '<argent-dictionary-record-table>', group: 'Данные и формы',
    icon: 'pi pi-th-large', summary: 'Таблица записей, которая строит колонки по зарегистрированной серверной схеме.',
    tags: ['справочник', 'CRUD', 'DTO', 'таблица'],
    examples: [{ title: 'Таблица по схеме', description: 'В реальной админке schema и page поступают из API справочников.', language: 'html', code: `<argent-dictionary-record-table
    [schema]="schema"
    [page]="page"
    [loading]="loading"
    [selected]="selected"
    (selectedChange)="selected = $event"
    (queryChange)="loadRecords($event)"
    (filterChange)="applyFilter($event)"
/>

// В реальном коде запросы отправляются в DynamicDictionaryApiService.` }],
    api: [
      { name: 'schema', kind: 'Вход', type: 'DynamicDictionarySchema | null', defaultValue: 'обязательно', description: 'Колонки и поля таблицы.' },
      { name: 'page', kind: 'Вход', type: 'DynamicPage<DictionaryRecord> | null', defaultValue: 'null', description: 'Ответ backend со строками и числом записей.' },
      { name: 'loading', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Состояние загрузки.' },
      { name: 'selected', kind: 'Вход', type: 'DictionaryRecord | null', defaultValue: 'null', description: 'Текущая выбранная запись.' },
      { name: 'filters', kind: 'Вход', type: 'Record<string, string>', defaultValue: '{}', description: 'Активные фильтры.' },
      { name: 'selectedChange', kind: 'Событие', type: 'DictionaryRecord | null', defaultValue: '—', description: 'Выбрана запись.' },
      { name: 'queryChange', kind: 'Событие', type: 'TableLazyLoadEvent', defaultValue: '—', description: 'Сортировка и пагинация.' },
      { name: 'filterChange', kind: 'Событие', type: '{field, value}', defaultValue: '—', description: 'Новое значение фильтра.' },
    ],
    notes: ['Компонент не делает сетевой запрос сам: данные загружает страница-владелец.', 'Для обычной собственной сущности без серверной схемы чаще удобнее использовать ArgentTable напрямую.'],
  },
  {
    slug: 'dictionary-dialog', title: 'Диалог записи справочника', selector: '<argent-dictionary-record-dialog>', group: 'Данные и формы',
    icon: 'pi pi-window-maximize', summary: 'Готовый диалог создания, редактирования и просмотра с вложениями и аудитом.',
    tags: ['диалог', 'редактирование', 'создание', 'просмотр'], requiresBackend: true,
    examples: [{ title: 'Редактирование записи', description: 'При открытии с recordId компонент заново запрашивает DTO с backend.', language: 'html', code: `<argent-dictionary-record-dialog
    code="dict_demo_order"
    [schema]="schema"
    [recordId]="selectedId"
    [visible]="visible"
    (visibleChange)="visible = $event"
    (saved)="refreshTable()"
/>

// readonly=true — только просмотр и скачивание вложений.
// Для существующей записи укажи её ID, иначе диалог создаёт новую.` }],
    api: [
      { name: 'code', kind: 'Вход', type: 'string', defaultValue: 'обязательно', description: 'Код справочника или пользовательской таблицы.' },
      { name: 'schema', kind: 'Вход', type: 'DynamicDictionarySchema | null', defaultValue: 'обязательно', description: 'Схема редактора.' },
      { name: 'recordId', kind: 'Вход', type: 'string | null', defaultValue: 'null', description: 'ID редактируемой записи; null создаёт новую.' },
      { name: 'visible', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Отображать диалог.' },
      { name: 'readonly', kind: 'Вход', type: 'boolean', defaultValue: 'false', description: 'Только просмотр.' },
      { name: 'visibleChange', kind: 'Событие', type: 'boolean', defaultValue: '—', description: 'Диалог открыт или закрыт.' },
      { name: 'saved', kind: 'Событие', type: 'void', defaultValue: '—', description: 'Сохранение успешно.' },
    ],
    notes: ['Рабочая запись и права проверяются backend, а не флагом readonly.', 'В демо показан режим readonly без вызовов сохранения; для полноценного CRUD открой раздел «Данные».'],
  },
  {
    slug: 'grants', title: 'Редактор прав', selector: '<argent-grants-editor>', group: 'Данные и формы',
    icon: 'pi pi-lock', summary: 'Редактирование разрешений tables/read/write и actions как стандартного Angular FormControl.',
    tags: ['права', 'роли', 'grants', 'ControlValueAccessor'],
    examples: [{ title: 'Управление грантами', description: 'Работает локально: редактируй гранты и смотри нормализованное значение.', language: 'html', code: `<argent-grants-editor [formControl]="grantsControl" />

// TS
readonly grantsControl = new FormControl<Grants>({
    tables: { dict_demo_order: ['read'] },
    actions: ['admin'],
}, { nonNullable: true });` }],
    api: [
      { name: 'catalog', kind: 'Вход', type: 'GrantsCatalog | null', defaultValue: 'null', description: 'Подсказки доступных таблиц и actions из API.' },
      { name: 'inputId', kind: 'Вход', type: 'string', defaultValue: 'argent-grants', description: 'Префикс id внутренних полей.' },
      { name: 'formControl', kind: 'Вход', type: 'FormControl<Grants>', defaultValue: 'обязательно', description: 'Используется через ControlValueAccessor.' },
    ],
    notes: ['Можно переключиться между визуальным режимом и JSON.', 'Доступ по роли рассчитывает backend; этот компонент редактирует только структуру грантов.'],
  },
];

/** Минимальные импорты в standalone-компонент / конфигурацию приложения. */
export const COMPONENT_IMPORTS: Readonly<Record<string, string>> = {
  table: `import { ArgentTableComponent, ArgentTableColumnComponent, ArgentTableQuery } from '@argent/webapp-common';

@Component({
    standalone: true,
    imports: [ArgentTableComponent, ArgentTableColumnComponent],
    templateUrl: './my-page.html',
})
export class MyPage { /* rows, loadPage, ... */ }`,
  columns: `import {
    ArgentTableComponent, ArgentTableColumnComponent, ArgentTableCellDirective,
} from '@argent/webapp-common';

@Component({
    standalone: true,
    imports: [ArgentTableComponent, ArgentTableColumnComponent, ArgentTableCellDirective],
})`,
  toolbar: `import {
    ArgentTableComponent, ArgentTableColumnComponent,
    ArgentTableToolbarStartDirective, ArgentTableToolbarEndDirective,
} from '@argent/webapp-common';

@Component({
    standalone: true,
    imports: [ArgentTableComponent, ArgentTableColumnComponent,
        ArgentTableToolbarStartDirective, ArgentTableToolbarEndDirective],
})`,
  attachments: `import { AttachmentsComponent } from '@argent/webapp-common';

@Component({ standalone: true, imports: [AttachmentsComponent] })
export class FilesPage { /* entityId */ }`,
  reports: `import { ArgentReportService, ArgentReportDialogComponent } from '@argent/webapp-common';

// Страница с кнопками:
private readonly reports = inject(ArgentReportService);

// Один раз в корневом layout:
// @Component({ imports: [ArgentReportDialogComponent] })
// <argent-report-dialog />`,
  audit: `import { AuditLogComponent } from '@argent/webapp-common';

@Component({ standalone: true, imports: [AuditLogComponent] })
export class AuditPage { /* entityId */ }`,
  'entity-select': `import { ArgentEntitySelectComponent } from '@argent/webapp-common';\nimport { ReactiveFormsModule } from '@angular/forms';\n\n@Component({ standalone: true, imports: [ReactiveFormsModule, ArgentEntitySelectComponent] })\nexport class EditDocumentPage { /* свой endpoint и форма */ }`,
  'dynamic-form': `import {
    DictionaryDynamicFormComponent, DynamicDictionaryFormService,
    DynamicDictionarySchema,
} from '@argent/webapp-common';

@Component({ standalone: true, imports: [DictionaryDynamicFormComponent] })
export class EditPage { /* form and schema from backend */ }`,
  'dictionary-table': `import { DictionaryRecordTableComponent } from '@argent/webapp-common';

@Component({ standalone: true, imports: [DictionaryRecordTableComponent] })`,
  'dictionary-dialog': `import { DictionaryRecordDialogComponent } from '@argent/webapp-common';

@Component({ standalone: true, imports: [DictionaryRecordDialogComponent] })`,
  grants: `import { ReactiveFormsModule } from '@angular/forms';
import { GrantsEditorComponent, Grants } from '@argent/webapp-common';

@Component({ standalone: true, imports: [GrantsEditorComponent, ReactiveFormsModule] })`,
  errors: `import { ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent, applyServerErrors } from '@argent/webapp-common';

@Component({ standalone: true, imports: [FieldErrorComponent, ReactiveFormsModule] })`,
  admin: `import { ARGENT_AUTH_ROUTES, ARGENT_ROUTES } from '@argent/webapp-common';

// app.routes.ts
export const routes = [...ARGENT_AUTH_ROUTES, ...ARGENT_ROUTES];`,
};
