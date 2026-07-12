# Privacy Policy

_Last updated: 2026-07-01_

## English

AIMETON Cloud Bridge runs locally inside the user's vault application.

The plugin:

- does not operate an author-controlled backend;
- does not collect analytics or telemetry;
- does not send vault contents, file lists, tokens, or proxy credentials to the author;
- sends requests to Yandex Disk API and file endpoints;
- when configured on desktop, routes those requests through the proxy selected by the user;
- reads local files only when the user uploads them;
- writes local files only when the user downloads them;
- performs uploads and downloads only after a user action.

### Credential storage in version 1.0.3

The OAuth token and optional proxy password are stored locally in the plugin's `data.json`. They are not encrypted by the plugin. Users should protect access to the device, vault, and `.obsidian/plugins/aimeton-cloud-bridge/` directory. The `data.json` file must never be committed to Git or included in bug reports.

When a custom proxy is enabled, the proxy operator can observe connection metadata. Users are responsible for choosing a trusted proxy provider.

## Русский

AIMETON Cloud Bridge работает локально внутри приложения пользователя.

Плагин:

- не использует сервер, контролируемый автором;
- не собирает аналитику и телеметрию;
- не отправляет автору содержимое хранилища, списки файлов, токены или данные прокси;
- обращается к API и файловым узлам Яндекс.Диска;
- при ручной настройке на компьютере направляет запросы через выбранный пользователем прокси;
- читает локальные файлы только при их загрузке пользователем;
- записывает локальные файлы только при их скачивании пользователем;
- выполняет загрузку и скачивание только после действия пользователя.

### Хранение учётных данных в версии 1.0.3

OAuth-токен и необязательный пароль прокси хранятся локально в файле `data.json` плагина. Плагин их не шифрует. Пользователь должен защищать доступ к устройству, хранилищу и каталогу `.obsidian/plugins/aimeton-cloud-bridge/`. Файл `data.json` нельзя добавлять в Git или прикладывать к отчётам об ошибках.

При использовании пользовательского прокси его оператор может видеть метаданные соединений. Пользователь должен выбирать доверенного провайдера прокси.
