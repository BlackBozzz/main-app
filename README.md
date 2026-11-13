# main-app

Демо-хост библиотеки [`@argent/webapp-common`](../webapp-common/README.md) (Angular 21,
PrimeNG 21): вход и админка Argent поверх `../main-backend`. Своего кода почти нет —
`app.config.ts` и `app.routes.ts`.

## Запуск

1. **Node 22.12+ или 24 LTS** (системный подходит).

   Проверка: `node -v` — `v22.12.0`/`v24.x` или новее.

2. **Пакет библиотеки 0.6.0** (собирается из соседней папки):

   ```bash
   cd ../webapp-common && npm install && npm run build && cd dist/webapp-common && npm pack
   cd ../../../main-app
   npm install ../webapp-common/dist/webapp-common/argent-webapp-common-0.6.0.tgz
   ```

   После пересборки архива той же версии повторите последнюю команду: обычный `npm install`
   возьмёт старый пакет из кэша.

   Проверка: `npm ls @argent/webapp-common` показывает `0.6.0`.

3. **Backend** `../main-backend` запущен на `http://localhost:8080` (см. его README).

4. **Dev-сервер:**

   ```bash
   npm start      # ng serve, http://localhost:4200
   ```

   `/api/**` проксируется на `http://localhost:8080` (`proxy.conf.json`, подключён в `angular.json`).

   Проверка: `http://localhost:4200/` открывает страницу входа.

## Вход

Логин `admin`; пароль — только если backend запущен без профиля `demo` (значение
`ARGENT_ADMIN_PASSWORD`). Пользователей с ролями `READER`, `EDITOR`, `MANAGER` создайте в
«Пользователи» и войдите под ними, чтобы увидеть, как меняются кнопки.

## Что посмотреть в админке

- **Справочники** → «Демо-заказы» (`dict_demo_order`), «Страны» и др.: поиск, фильтры, кнопки
  **Экспорт XLSX/CSV** и **Импорт** (диалог UPSERT/REPLACE с отчётом по строкам; нужно действие `import`).
- Выберите запись → «Редактировать»: вкладки **«Поля»**, **«Файлы»** (загрузка, скачивание,
  удаление вложений), **«История»** (кто и что менял, включая файлы).
- **Журнал изменений** (`/admin/audit`, только `admin`): все изменения с фильтрами по таблице,
  записи, действию и периоду.
- **Пользователи** и **Роли** (`admin`): создание, назначение ролей, редактор грантов.
- Ошибки прав: под `READER` нет кнопок изменения; 403 от backend — toast «Недостаточно прав».

## Сборка и тесты

```bash
npm run build      # бюджет initial поднят до 1.5MB из-за PrimeNG
npm test
```

## Новый демонстрационный стенд

Главная страница `/demo`: почта, очереди, QueryDSL, JasperReports, статусы/номера и файлы. Полный гид — [`README_SHOWCASE_RU.md`](../README_SHOWCASE_RU.md).
