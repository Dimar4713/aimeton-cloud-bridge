/*
AIMETON Cloud Bridge — universal bilingual mobile/desktop compatibility build v1.0.5
Plugin ID: aimeton-cloud-bridge
*/

const {
    Plugin,
    PluginSettingTab,
    Setting,
    Notice,
    TFile,
    normalizePath,
    Modal,
    requestUrl,
    Platform,
} = require('obsidian');

const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const VIEW_TYPE = 'aimeton-cloud-bridge';
const MAX_REDIRECTS = 8;

const I18N = {
    ru: {
        'plugin.ribbon': 'AIMETON Cloud Bridge',
        'command.open': 'Открыть AIMETON Cloud Bridge',
        'view.title': '☁️ Яндекс.Диск',
        'root.disk': 'Диск',
        'common.ok': 'ОК',
        'common.cancel': 'Отмена',
        'common.delete': 'Удалить',
        'common.confirm': 'Подтверждение',
        'common.notSet': 'не задан',
        'common.items': '{count} элементов',
        'common.range': '{start}–{end} из {total}',
        'common.folder': 'Папка',
        'common.secondsElapsed': 'прошло {seconds} с',
        'common.of': '{loaded} из {total}',
        'common.size': 'Размер: {size}',
        'common.dismiss': 'Скрыть',

        'toolbar.refresh': 'Обновить',
        'toolbar.up': 'На уровень выше',
        'toolbar.newFolder': 'Новая папка',
        'toolbar.search': 'Поиск…',
        'toolbar.upload': 'Загрузить',
        'toolbar.sort.nameAsc': 'Имя ↑',
        'toolbar.sort.nameDesc': 'Имя ↓',
        'toolbar.sort.dateAsc': 'Дата ↑',
        'toolbar.sort.dateDesc': 'Дата ↓',
        'toolbar.sort.sizeAsc': 'Размер ↑',
        'toolbar.sort.sizeDesc': 'Размер ↓',
        'dropzone': 'Перетащите файлы сюда для загрузки',
        'loading': 'Загрузка…',
        'folder.empty': 'Папка пуста',
        'pagination.back': '◀ Назад',
        'pagination.next': 'Вперёд ▶',
        'error.connection': 'Ошибка соединения',
        'error.loading': 'Ошибка загрузки',
        'error.checkToken': 'Проверьте OAuth-токен',
        'action.openProxySettings': 'Открыть настройки прокси',
        'action.downloadVault': 'Скачать в хранилище',
        'action.preview': 'Предпросмотр',
        'action.copyPublicLink': 'Скопировать публичную ссылку',
        'notice.linkCopied': 'Ссылка скопирована.',
        'notice.resourcePublished': 'Ресурс опубликован.',
        'action.previewPlugin': 'Предпросмотр через плагин',
        'action.openBrowser': 'Открыть во внешнем браузере',
        'action.move': 'Переместить',
        'action.copy': 'Копировать',
        'action.delete': 'Удалить',
        'action.open': 'Открыть',
        'dialog.newFolder': 'Новая папка',
        'dialog.folderName': 'Введите имя папки:',
        'notice.folderCreated': 'Папка создана.',
        'error.folderCreate': 'Не удалось создать папку: {error}',
        'dialog.deleteQuestion': 'Удалить «{name}»?',
        'notice.deleted': 'Удалено.',
        'error.delete': 'Ошибка удаления: {error}',
        'dialog.move': 'Перемещение',
        'dialog.destinationPath': 'Введите путь назначения:',
        'notice.moved': 'Перемещено.',
        'error.move': 'Ошибка перемещения: {error}',
        'dialog.copy': 'Копирование',
        'notice.copied': 'Скопировано.',
        'error.copy': 'Ошибка копирования: {error}',
        'notice.uploaded': 'Загружено: {name}',
        'error.upload': 'Ошибка загрузки: {error}',
        'operation.running': 'Выполняется операция…',
        'setup.title': 'Требуется настройка',
        'setup.text': 'Введите OAuth-токен в настройках плагина.<br>При необходимости настройте сетевое соединение.',

        'download.disabled': 'Скачивание отключено в настройках.',
        'upload.disabled': 'Загрузка отключена в настройках.',
        'file.notFound': 'Файл не найден.',
        'download.already': 'Файл уже скачивается: {name}',
        'download.title': 'Скачивание: {name}',
        'download.fileSize': 'Размер файла: {size}',
        'download.prepareLink': 'Подготовка ссылки…',
        'download.preparing': '⏳ Подготовка скачивания…',
        'download.started': 'Скачивание началось: {name}',
        'download.getLinkTitle': 'Получение ссылки: {name}',
        'download.getLinkDetail': 'Запрос временной ссылки у Яндекс.Диска…',
        'download.getLinkRow': '⏳ Получение ссылки…',
        'download.savingTitle': 'Сохранение: {name}',
        'download.savingDetail': 'Запись файла в хранилище Obsidian…',
        'download.savingRow': '💾 Сохранение в хранилище…',
        'download.receiving': 'Получение данных…',
        'download.row': '⬇️ Скачивание…',
        'download.rowPercent': '⬇️ Скачивание: {percent}%',
        'download.doneTitle': 'Скачано: {name}',
        'download.savedPath': 'Сохранено в: {path}',
        'download.doneRow': '✅ Скачано',
        'download.errorTitle': 'Ошибка скачивания: {name}',
        'download.errorRow': '❌ Ошибка скачивания',
        'download.errorNotice': 'Ошибка скачивания: {error}',

        'preview.noPath': 'Не удалось определить путь изображения.',
        'preview.loadingProxy': 'Загрузка предпросмотра через ручной прокси…',
        'preview.loading': 'Загрузка предпросмотра…',
        'preview.originalFallback': 'Уменьшенный предпросмотр Яндекс.Диска был недоступен, поэтому загружен оригинал.',
        'preview.downloadVault': '⬇️ Скачать в хранилище',
        'preview.copyUrl': '📋 Скопировать URL',
        'preview.urlCopied': 'Временный URL изображения скопирован.',
        'preview.error': 'Не удалось загрузить предпросмотр: {error}',
        'preview.downloadInstead': '⬇️ Скачать файл вместо просмотра',
        'preview.source.list': 'предпросмотр из списка',
        'preview.source.fresh': 'свежий предпросмотр',
        'preview.source.direct': 'свежая прямая ссылка',
        'preview.source.download': 'оригинал через свежую ссылку скачивания',

        'network.mobileLabel': 'Системное соединение мобильного Obsidian',
        'network.systemLabel': 'Системное соединение Obsidian',
        'network.mobileBadge': 'Мобильное соединение через систему/VPN',
        'network.manualBadge': 'Строгий прокси: {proxy}',
        'network.systemBadge': 'Системное соединение Obsidian',
        'network.mobileHelp': 'На Android/iOS запросы выполняются через requestUrl Obsidian и системный сетевой стек телефона. Используйте VPN/TUN или системный прокси устройства.',
        'network.manualHelp': 'Все сетевые запросы плагина выполняются только через указанный прокси. Прямого резервного подключения нет.',
        'network.systemHelp': 'Используется requestUrl Obsidian и сетевые настройки приложения или операционной системы.',
        'network.unsupportedProxy': 'Неподдерживаемый тип прокси: {type}',
        'network.proxyHostRequired': 'Не указан адрес прокси-сервера.',
        'network.proxyPortInvalid': 'Порт прокси должен быть целым числом от 1 до 65535.',
        'network.invalidJson': 'Яндекс.Диск вернул некорректный JSON: {error}',
        'network.obsidianError': 'Ошибка {platform} соединения Obsidian: {error}',
        'network.mobileWord': 'мобильного',
        'network.systemWord': 'системного',
        'network.tooManyRedirects': 'Слишком много перенаправлений (больше {max}).',
        'network.unsupportedProtocol': 'Неподдерживаемый протокол назначения: {protocol}',
        'network.httpProxyTimeout': 'Тайм-аут подключения к HTTP-прокси.',
        'network.proxyCredentialsHint': ' Проверьте логин и пароль прокси.',
        'network.httpConnectError': 'HTTP CONNECT прокси вернул {status}.{suffix}',
        'network.proxyRejectedConnect': 'Прокси отклонил CONNECT: HTTP {status}.',
        'network.socksTimeout': 'Тайм-аут подключения к SOCKS5-прокси.',
        'network.socksVersion': 'Некорректная версия SOCKS-прокси.',
        'network.socksNoAuth': 'SOCKS5-прокси не принял доступные методы авторизации.',
        'network.socksCredentialsLong': 'Логин или пароль SOCKS5 длиннее 255 байт.',
        'network.socksAuthRejected': 'SOCKS5-прокси отклонил логин или пароль.',
        'network.socksAuthMethod': 'SOCKS5 выбрал неподдерживаемый метод авторизации: {method}.',
        'network.targetHostLong': 'Слишком длинное имя целевого хоста.',
        'network.socksReply': 'Некорректный ответ SOCKS5-прокси.',
        'network.socksConnectError': 'SOCKS5 CONNECT завершился ошибкой {code} ({description}).',
        'network.socksAddressType': 'SOCKS5 вернул неизвестный тип адреса: {type}.',
        'network.socksClosed': 'Прокси закрыл соединение во время SOCKS5-рукопожатия.',
        'network.tlsTimeout': 'Тайм-аут TLS-рукопожатия.',
        'network.proxyRequestTimeout': 'Тайм-аут сетевого запроса через прокси.',
        'network.bufferUnavailable': 'Node.js Buffer недоступен: ручной прокси можно использовать только в настольном Obsidian.',
        'network.unsupportedBody': 'Неподдерживаемый тип тела запроса.',
        'network.unsupportedRequestUrlBody': 'Неподдерживаемый тип тела запроса для requestUrl.',
        'network.arrayBufferError': 'Не удалось преобразовать бинарные данные в ArrayBuffer.',
        'network.imageContentType': 'Сервер вернул {contentType} вместо изображения.',
        'network.downloadImageContentType': 'Ссылка скачивания вернула {contentType} вместо изображения.',
        'network.noImageUrl': 'Яндекс.Диск не вернул доступную ссылку изображения.',
        'socks.general': 'общая ошибка',
        'socks.rules': 'соединение запрещено правилами',
        'socks.network': 'сеть недоступна',
        'socks.host': 'хост недоступен',
        'socks.refused': 'соединение отклонено',
        'socks.ttl': 'истёк TTL',
        'socks.command': 'команда не поддерживается',
        'socks.address': 'тип адреса не поддерживается',
        'socks.unknown': 'неизвестная ошибка',

        'settings.title': 'AIMETON Cloud Bridge',
        'settings.language': 'Язык интерфейса',
        'settings.languageDesc': 'Язык панели, настроек, уведомлений и сообщений плагина.',
        'settings.languageChanged': 'Язык интерфейса изменён.',
        'settings.oauth': 'OAuth-токен Яндекс.Диска',
        'settings.oauthDesc': 'Токен хранится локально в data.json плагина. Не передавайте папку плагина посторонним.',
        'settings.oauthHelpTitle': 'Как получить OAuth-токен',
        'settings.oauthHelpStep1': 'Перейдите на',
        'settings.oauthHelpPolygon': 'Yandex Disk Полигон',
        'settings.oauthHelpStep2': 'Авторизуйтесь под аккаунтом Яндекса, к Диску которого нужен доступ.',
        'settings.oauthHelpStep3': 'Нажмите «Получить OAuth-токен» и разрешите доступ к Яндекс.Диску.',
        'settings.oauthHelpStep4': 'Скопируйте выданный токен — обычно он начинается с y0_.',
        'settings.oauthHelpStep5': 'Вставьте токен в поле выше и нажмите «Проверить».',
        'settings.oauthHelpFallback': 'Если Полигон недоступен, используйте',
        'settings.oauthHelpOfficial': 'официальную инструкцию Яндекс OAuth',
        'settings.oauthHelpSecurity': 'Никому не передавайте токен. Он предоставляет доступ к вашему Яндекс.Диску.',
        'settings.rootPath': 'Корневой путь',
        'settings.rootPathDesc': 'Например: disk:/ или disk:/Документы',
        'settings.pageSize': 'Элементов на странице',
        'settings.pageSizeDesc': 'От 10 до 100.',
        'settings.enableDownloads': 'Разрешить скачивание',
        'settings.downloadFolder': 'Папка для скачанных файлов',
        'settings.downloadFolderDesc': 'Путь внутри текущего хранилища Obsidian.',
        'settings.enableUploads': 'Разрешить загрузку',
        'settings.cache': 'Время кэширования списка',
        'settings.cacheDesc': 'Количество секунд. 0 практически отключает кэширование.',
        'settings.networkHeading': 'Сетевое соединение',
        'settings.mobileMode': 'Режим подключения на телефоне',
        'settings.mobileModeDesc': 'Мобильный Obsidian использует requestUrl и системный сетевой стек Android/iOS. Для маршрутизации через прокси включите VPN/TUN или системный прокси на устройстве.',
        'settings.mobileModeValue': 'Системное соединение / VPN / TUN',
        'settings.mobileManualSaved': 'Ручной прокси настроен и сохранён для настольного Obsidian, но на этом мобильном устройстве он не применяется. Параметры сохранятся и снова заработают на компьютере.',
        'settings.mobileProxyInfo': 'Встроенный HTTP/HTTPS/SOCKS5-прокси доступен только на компьютере. На телефоне используйте системный VPN/TUN-клиент.',
        'settings.networkMode': 'Режим подключения',
        'settings.networkModeDesc': 'В ручном режиме все API-запросы, загрузки, скачивания, перенаправления и предпросмотры идут только через указанный прокси. Прямого резервного подключения нет.',
        'settings.systemMode': 'Системное соединение Obsidian',
        'settings.manualMode': 'Ручной прокси — строгий режим',
        'settings.strictWarning': 'Строгий режим: если прокси недоступен или авторизация не проходит, операция завершится ошибкой. Плагин не попробует системное или прямое соединение.',
        'settings.proxyType': 'Тип прокси',
        'settings.socksDns': 'SOCKS5 (DNS через прокси)',
        'settings.proxyHost': 'Адрес прокси-сервера',
        'settings.proxyHostDesc': 'Только имя хоста или IP, без http:// и без пути.',
        'settings.proxyHostPlaceholder': '127.0.0.1 или proxy.example.com',
        'settings.proxyPort': 'Порт прокси',
        'settings.proxyAuth': 'Прокси требует авторизацию',
        'settings.proxyUsername': 'Пользователь прокси',
        'settings.proxyPassword': 'Пароль прокси',
        'settings.proxyPasswordDesc': 'Хранится локально без шифрования в data.json плагина.',
        'settings.timeout': 'Тайм-аут запроса',
        'settings.timeoutDesc': 'В секундах, от 5 до 300.',
        'settings.connectionTest': 'Проверка подключения',
        'settings.testMobileDesc': 'Запрос будет выполнен через мобильный requestUrl и системный VPN/TUN или сетевое соединение телефона.',
        'settings.testManualDesc': 'Запрос к Яндекс.Диску будет выполнен строго через {proxy}.',
        'settings.testSystemDesc': 'Запрос будет выполнен через системное соединение Obsidian.',
        'settings.check': 'Проверить',
        'settings.checking': 'Проверка…',
        'settings.free': ' Свободно: {size}.',
        'settings.success': 'Подключение успешно.{free}',
        'settings.oauthRejected': 'Соединение с Яндекс.Диском установлено, но OAuth-токен отклонён (HTTP 401).',
        'settings.connectionError': 'Ошибка подключения: {error}',
    },
    en: {
        'plugin.ribbon': 'AIMETON Cloud Bridge',
        'command.open': 'Open AIMETON Cloud Bridge',
        'view.title': '☁️ Yandex Disk',
        'root.disk': 'Disk',
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.confirm': 'Confirm',
        'common.notSet': 'not set',
        'common.items': '{count} items',
        'common.range': '{start}–{end} of {total}',
        'common.folder': 'Folder',
        'common.secondsElapsed': '{seconds} s elapsed',
        'common.of': '{loaded} of {total}',
        'common.size': 'Size: {size}',
        'common.dismiss': 'Dismiss',

        'toolbar.refresh': 'Refresh',
        'toolbar.up': 'Up',
        'toolbar.newFolder': 'New folder',
        'toolbar.search': 'Search…',
        'toolbar.upload': 'Upload',
        'toolbar.sort.nameAsc': 'Name ↑',
        'toolbar.sort.nameDesc': 'Name ↓',
        'toolbar.sort.dateAsc': 'Date ↑',
        'toolbar.sort.dateDesc': 'Date ↓',
        'toolbar.sort.sizeAsc': 'Size ↑',
        'toolbar.sort.sizeDesc': 'Size ↓',
        'dropzone': 'Drag files here to upload',
        'loading': 'Loading…',
        'folder.empty': 'Folder is empty',
        'pagination.back': '◀ Back',
        'pagination.next': 'Next ▶',
        'error.connection': 'Connection error',
        'error.loading': 'Loading error',
        'error.checkToken': 'Check the OAuth token',
        'action.openProxySettings': 'Open proxy settings',
        'action.downloadVault': 'Download to vault',
        'action.preview': 'Preview',
        'action.copyPublicLink': 'Copy public link',
        'notice.linkCopied': 'Link copied.',
        'notice.resourcePublished': 'Resource published.',
        'action.previewPlugin': 'Preview in plugin',
        'action.openBrowser': 'Open in external browser',
        'action.move': 'Move',
        'action.copy': 'Copy',
        'action.delete': 'Delete',
        'action.open': 'Open',
        'dialog.newFolder': 'New folder',
        'dialog.folderName': 'Enter folder name:',
        'notice.folderCreated': 'Folder created.',
        'error.folderCreate': 'Failed to create folder: {error}',
        'dialog.deleteQuestion': 'Delete “{name}”?',
        'notice.deleted': 'Deleted.',
        'error.delete': 'Delete error: {error}',
        'dialog.move': 'Move',
        'dialog.destinationPath': 'Enter destination path:',
        'notice.moved': 'Moved.',
        'error.move': 'Move error: {error}',
        'dialog.copy': 'Copy',
        'notice.copied': 'Copied.',
        'error.copy': 'Copy error: {error}',
        'notice.uploaded': 'Uploaded: {name}',
        'error.upload': 'Upload error: {error}',
        'operation.running': 'Operation in progress…',
        'setup.title': 'Setup required',
        'setup.text': 'Enter the OAuth token in the plugin settings.<br>Configure the network connection when required.',

        'download.disabled': 'Downloads are disabled in settings.',
        'upload.disabled': 'Uploads are disabled in settings.',
        'file.notFound': 'File not found.',
        'download.already': 'This file is already downloading: {name}',
        'download.title': 'Downloading: {name}',
        'download.fileSize': 'File size: {size}',
        'download.prepareLink': 'Preparing link…',
        'download.preparing': '⏳ Preparing download…',
        'download.started': 'Download started: {name}',
        'download.getLinkTitle': 'Getting link: {name}',
        'download.getLinkDetail': 'Requesting a temporary link from Yandex Disk…',
        'download.getLinkRow': '⏳ Getting link…',
        'download.savingTitle': 'Saving: {name}',
        'download.savingDetail': 'Writing the file to the Obsidian vault…',
        'download.savingRow': '💾 Saving to vault…',
        'download.receiving': 'Receiving data…',
        'download.row': '⬇️ Downloading…',
        'download.rowPercent': '⬇️ Downloading: {percent}%',
        'download.doneTitle': 'Downloaded: {name}',
        'download.savedPath': 'Saved to: {path}',
        'download.doneRow': '✅ Downloaded',
        'download.errorTitle': 'Download error: {name}',
        'download.errorRow': '❌ Download error',
        'download.errorNotice': 'Download error: {error}',

        'preview.noPath': 'Could not determine the image path.',
        'preview.loadingProxy': 'Loading preview through the manual proxy…',
        'preview.loading': 'Loading preview…',
        'preview.originalFallback': 'The reduced Yandex Disk preview was unavailable, so the original image was loaded.',
        'preview.downloadVault': '⬇️ Download to vault',
        'preview.copyUrl': '📋 Copy URL',
        'preview.urlCopied': 'Temporary image URL copied.',
        'preview.error': 'Could not load preview: {error}',
        'preview.downloadInstead': '⬇️ Download file instead',
        'preview.source.list': 'preview URL from the list',
        'preview.source.fresh': 'fresh preview URL',
        'preview.source.direct': 'fresh direct URL',
        'preview.source.download': 'original through a fresh download URL',

        'network.mobileLabel': 'Mobile Obsidian system connection',
        'network.systemLabel': 'Obsidian system connection',
        'network.mobileBadge': 'Mobile system/VPN connection',
        'network.manualBadge': 'Strict proxy: {proxy}',
        'network.systemBadge': 'Obsidian system connection',
        'network.mobileHelp': 'On Android/iOS, requests use Obsidian requestUrl and the device network stack. Use the device VPN/TUN or system proxy.',
        'network.manualHelp': 'All plugin network requests use only the configured proxy. There is no direct fallback.',
        'network.systemHelp': 'Uses Obsidian requestUrl and the application or operating-system network settings.',
        'network.unsupportedProxy': 'Unsupported proxy type: {type}',
        'network.proxyHostRequired': 'Proxy server address is not specified.',
        'network.proxyPortInvalid': 'Proxy port must be an integer from 1 to 65535.',
        'network.invalidJson': 'Yandex Disk returned invalid JSON: {error}',
        'network.obsidianError': 'Obsidian {platform} connection error: {error}',
        'network.mobileWord': 'mobile',
        'network.systemWord': 'system',
        'network.tooManyRedirects': 'Too many redirects (more than {max}).',
        'network.unsupportedProtocol': 'Unsupported destination protocol: {protocol}',
        'network.httpProxyTimeout': 'HTTP proxy connection timed out.',
        'network.proxyCredentialsHint': ' Check the proxy username and password.',
        'network.httpConnectError': 'HTTP CONNECT proxy returned {status}.{suffix}',
        'network.proxyRejectedConnect': 'Proxy rejected CONNECT: HTTP {status}.',
        'network.socksTimeout': 'SOCKS5 proxy connection timed out.',
        'network.socksVersion': 'Invalid SOCKS proxy version.',
        'network.socksNoAuth': 'SOCKS5 proxy rejected all available authentication methods.',
        'network.socksCredentialsLong': 'SOCKS5 username or password exceeds 255 bytes.',
        'network.socksAuthRejected': 'SOCKS5 proxy rejected the username or password.',
        'network.socksAuthMethod': 'SOCKS5 selected an unsupported authentication method: {method}.',
        'network.targetHostLong': 'Destination hostname is too long.',
        'network.socksReply': 'Invalid SOCKS5 proxy response.',
        'network.socksConnectError': 'SOCKS5 CONNECT failed with code {code} ({description}).',
        'network.socksAddressType': 'SOCKS5 returned an unknown address type: {type}.',
        'network.socksClosed': 'The proxy closed the connection during the SOCKS5 handshake.',
        'network.tlsTimeout': 'TLS handshake timed out.',
        'network.proxyRequestTimeout': 'Network request through the proxy timed out.',
        'network.bufferUnavailable': 'Node.js Buffer is unavailable: manual proxy mode is supported only in desktop Obsidian.',
        'network.unsupportedBody': 'Unsupported request body type.',
        'network.unsupportedRequestUrlBody': 'Unsupported request body type for requestUrl.',
        'network.arrayBufferError': 'Could not convert binary data to ArrayBuffer.',
        'network.imageContentType': 'The server returned {contentType} instead of an image.',
        'network.downloadImageContentType': 'The download link returned {contentType} instead of an image.',
        'network.noImageUrl': 'Yandex Disk did not return an accessible image URL.',
        'socks.general': 'general failure',
        'socks.rules': 'connection not allowed by ruleset',
        'socks.network': 'network unreachable',
        'socks.host': 'host unreachable',
        'socks.refused': 'connection refused',
        'socks.ttl': 'TTL expired',
        'socks.command': 'command not supported',
        'socks.address': 'address type not supported',
        'socks.unknown': 'unknown error',

        'settings.title': 'AIMETON Cloud Bridge',
        'settings.language': 'Interface language',
        'settings.languageDesc': 'Language of the panel, settings, notifications, and plugin messages.',
        'settings.languageChanged': 'Interface language changed.',
        'settings.oauth': 'Yandex Disk OAuth token',
        'settings.oauthDesc': 'The token is stored locally in the plugin data.json file. Do not share the plugin folder.',
        'settings.oauthHelpTitle': 'How to get an OAuth token',
        'settings.oauthHelpStep1': 'Open the',
        'settings.oauthHelpPolygon': 'Yandex Disk API Polygon',
        'settings.oauthHelpStep2': 'Sign in with the Yandex account whose Disk you want to access.',
        'settings.oauthHelpStep3': 'Click “Get OAuth token” and allow access to Yandex Disk.',
        'settings.oauthHelpStep4': 'Copy the issued token — it usually starts with y0_.',
        'settings.oauthHelpStep5': 'Paste the token into the field above and click “Check”.',
        'settings.oauthHelpFallback': 'If the Polygon is unavailable, follow the',
        'settings.oauthHelpOfficial': 'official Yandex OAuth instructions',
        'settings.oauthHelpSecurity': 'Never share the token. It grants access to your Yandex Disk.',
        'settings.rootPath': 'Root path',
        'settings.rootPathDesc': 'For example: disk:/ or disk:/Documents',
        'settings.pageSize': 'Items per page',
        'settings.pageSizeDesc': 'From 10 to 100.',
        'settings.enableDownloads': 'Enable downloads',
        'settings.downloadFolder': 'Downloaded files folder',
        'settings.downloadFolderDesc': 'Path inside the current Obsidian vault.',
        'settings.enableUploads': 'Enable uploads',
        'settings.cache': 'List cache duration',
        'settings.cacheDesc': 'Number of seconds. 0 effectively disables caching.',
        'settings.networkHeading': 'Network connection',
        'settings.mobileMode': 'Mobile connection mode',
        'settings.mobileModeDesc': 'Mobile Obsidian uses requestUrl and the Android/iOS network stack. To route through a proxy, enable a device VPN/TUN or system proxy.',
        'settings.mobileModeValue': 'System connection / VPN / TUN',
        'settings.mobileManualSaved': 'The manual proxy is configured and saved for desktop Obsidian, but is not used on this mobile device. The settings are preserved and will work again on desktop.',
        'settings.mobileProxyInfo': 'The built-in HTTP/HTTPS/SOCKS5 proxy is available only on desktop. On mobile, use a system VPN/TUN client.',
        'settings.networkMode': 'Connection mode',
        'settings.networkModeDesc': 'In manual mode, all API requests, uploads, downloads, redirects, and previews use only the configured proxy. There is no direct fallback.',
        'settings.systemMode': 'Obsidian system connection',
        'settings.manualMode': 'Manual proxy — strict mode',
        'settings.strictWarning': 'Strict mode: if the proxy is unavailable or authentication fails, the operation stops with an error. The plugin will not try the system or direct connection.',
        'settings.proxyType': 'Proxy type',
        'settings.socksDns': 'SOCKS5 (DNS through proxy)',
        'settings.proxyHost': 'Proxy server address',
        'settings.proxyHostDesc': 'Hostname or IP only, without http:// and without a path.',
        'settings.proxyHostPlaceholder': '127.0.0.1 or proxy.example.com',
        'settings.proxyPort': 'Proxy port',
        'settings.proxyAuth': 'Proxy requires authentication',
        'settings.proxyUsername': 'Proxy username',
        'settings.proxyPassword': 'Proxy password',
        'settings.proxyPasswordDesc': 'Stored locally without encryption in the plugin data.json file.',
        'settings.timeout': 'Request timeout',
        'settings.timeoutDesc': 'In seconds, from 5 to 300.',
        'settings.connectionTest': 'Connection test',
        'settings.testMobileDesc': 'The request will use mobile requestUrl and the phone system VPN/TUN or network connection.',
        'settings.testManualDesc': 'The Yandex Disk request will use only {proxy}.',
        'settings.testSystemDesc': 'The request will use the Obsidian system connection.',
        'settings.check': 'Check',
        'settings.checking': 'Checking…',
        'settings.free': ' Free: {size}.',
        'settings.success': 'Connection successful.{free}',
        'settings.oauthRejected': 'The Yandex Disk connection succeeded, but the OAuth token was rejected (HTTP 401).',
        'settings.connectionError': 'Connection error: {error}',
    },
};


const DEFAULT_SETTINGS = {
    language: 'ru',
    oauthToken: '',
    rootPath: 'disk:/',
    pageSize: 20,
    showHidden: false,
    defaultSort: 'name',
    enableUploads: true,
    enableDownloads: true,
    downloadFolder: 'AIMETON/CloudBridge/Downloads',
    cacheTimeout: 300000,

    // Network settings. In manual mode there is intentionally no direct fallback.
    networkMode: 'system', // system | manual
    proxyType: 'http', // http | https | socks5
    proxyHost: '',
    proxyPort: 8080,
    proxyAuth: false,
    proxyUsername: '',
    proxyPassword: '',
    requestTimeout: 30000,
};

class YandexDiskExplorerPlugin extends Plugin {
    async onload() {
        try {
            await this.loadSettings();
        } catch (_) {
            this.settings = Object.assign({}, DEFAULT_SETTINGS);
            try { await this.saveData(this.settings); } catch (_) {}
            new Notice(this.getLanguage && this.getLanguage() === 'en'
                ? 'AIMETON Cloud Bridge reset incompatible settings. Re-enter the OAuth token in plugin settings.'
                : 'AIMETON Cloud Bridge сбросил несовместимые настройки. Повторно укажите OAuth-токен в настройках плагина.', 10000);
        }
        this.cache = new Map();
        this.explorerViews = new Set();

        this.registerView(
            VIEW_TYPE,
            (leaf) => new YandexDiskExplorerView(leaf, this)
        );

        this.ribbonIconEl = this.addRibbonIcon('cloud', this.t('plugin.ribbon'), () => {
            void this.activateView();
        });

        this.openCommand = this.addCommand({
            id: 'open-cloud-bridge',
            name: this.t('command.open'),
            callback: () => void this.activateView(),
        });

        this.addSettingTab(new YandexDiskSettingTab(this.app, this));
        
    }

    getLanguage() {
        return this.settings && this.settings.language === 'en' ? 'en' : 'ru';
    }

    getLocale() {
        return this.getLanguage() === 'en' ? 'en-US' : 'ru-RU';
    }

    t(key, vars = {}) {
        const language = this.getLanguage();
        const template = (I18N[language] && I18N[language][key])
            || (I18N.en && I18N.en[key])
            || key;
        return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
            const value = vars[name];
            return value === undefined || value === null ? `{${name}}` : String(value);
        });
    }

    refreshRegisteredLabels() {
        const ribbonLabel = this.t('plugin.ribbon');
        if (this.ribbonIconEl) {
            this.ribbonIconEl.setAttribute('aria-label', ribbonLabel);
            this.ribbonIconEl.setAttribute('data-tooltip-position', 'right');
        }
        if (this.openCommand) this.openCommand.name = this.t('command.open');
        const commandId = `${this.manifest && this.manifest.id ? this.manifest.id : 'aimeton-cloud-bridge'}:open-cloud-bridge`;
        if (this.app.commands && this.app.commands.commands && this.app.commands.commands[commandId]) {
            this.app.commands.commands[commandId].name = this.t('command.open');
        }
    }

    registerExplorerView(view) {
        if (view) this.explorerViews.add(view);
    }

    unregisterExplorerView(view) {
        if (view) this.explorerViews.delete(view);
    }

    getExplorerViews() {
        const views = new Set(this.explorerViews || []);
        const workspace = this.app && this.app.workspace;

        if (workspace && typeof workspace.getLeavesOfType === 'function') {
            for (const leaf of workspace.getLeavesOfType(VIEW_TYPE)) {
                if (leaf && leaf.view) views.add(leaf.view);
            }
        }

        // Mobile Obsidian can keep drawer/stack views outside the collection
        // returned by getLeavesOfType(). iterateAllLeaves catches those views.
        if (workspace && typeof workspace.iterateAllLeaves === 'function') {
            workspace.iterateAllLeaves((leaf) => {
                const view = leaf && leaf.view;
                if (!view) return;
                try {
                    if (typeof view.getViewType === 'function' && view.getViewType() === VIEW_TYPE) {
                        views.add(view);
                    }
                } catch (_) {}
            });
        }

        return views;
    }

    async refreshLocalizedViews() {
        this.refreshRegisteredLabels();
        const refreshes = [];

        for (const view of this.getExplorerViews()) {
            if (view && typeof view.refreshLanguage === 'function') {
                refreshes.push(Promise.resolve(view.refreshLanguage()));
            }
        }

        await Promise.allSettled(refreshes);

        const workspace = this.app && this.app.workspace;
        if (workspace && typeof workspace.trigger === 'function') {
            workspace.trigger('layout-change');
        }
    }

    async activateView() {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        }
        workspace.revealLeaf(leaf);
    }

    isMobileRuntime() {
        return Boolean(Platform && Platform.isMobileApp);
    }

    isDesktopRuntime() {
        return !this.isMobileRuntime();
    }

    isManualProxyConfigured() {
        return this.settings.networkMode === 'manual';
    }

    isManualProxyEnabled() {
        // A manually configured proxy is effective only on desktop. On mobile,
        // Obsidian requestUrl uses the OS/app network stack (including VPN/TUN).
        return this.isDesktopRuntime() && this.isManualProxyConfigured();
    }

    getEffectiveNetworkMode() {
        if (this.isMobileRuntime()) return 'mobile-system';
        return this.isManualProxyEnabled() ? 'manual' : 'system';
    }

    getProxyLabel() {
        if (this.isMobileRuntime()) return this.t('network.mobileLabel');
        if (!this.isManualProxyEnabled()) return this.t('network.systemLabel');
        const host = this.settings.proxyHost || this.t('common.notSet');
        const port = this.settings.proxyPort || '—';
        return `${this.settings.proxyType}://${host}:${port}`;
    }

    getProxyConfig() {
        if (!this.isManualProxyEnabled()) return null;

        const type = String(this.settings.proxyType || 'http').toLowerCase();
        if (!['http', 'https', 'socks5'].includes(type)) {
            throw new Error(this.t('network.unsupportedProxy', { type }));
        }

        const host = String(this.settings.proxyHost || '').trim();
        const port = Number(this.settings.proxyPort);
        if (!host) throw new Error(this.t('network.proxyHostRequired'));
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error(this.t('network.proxyPortInvalid'));
        }

        return {
            type,
            host,
            port,
            auth: Boolean(this.settings.proxyAuth),
            username: String(this.settings.proxyUsername || ''),
            password: String(this.settings.proxyPassword || ''),
        };
    }

    getRequestTimeout() {
        const timeout = Number(this.settings.requestTimeout);
        return Number.isFinite(timeout) && timeout >= 1000 ? timeout : 30000;
    }

    getHeaders() {
        return {
            Authorization: `OAuth ${this.settings.oauthToken}`,
            Accept: 'application/json',
        };
    }

    async apiRequest(method, endpoint, params = {}, body = undefined) {
        const url = new URL(`${API_BASE}${endpoint}`);
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        }

        const headers = this.getHeaders();
        let payload = body;
        if (body && this.isPlainObject(body)) {
            payload = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }

        const response = await this.networkRequest(url.toString(), {
            method,
            headers,
            body: payload,
        });

        if (this.binaryLength(response.buffer) === 0) return {};
        const text = this.binaryToText(response.buffer);
        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error(this.t('network.invalidJson', { error: error.message }));
        }
    }

    isNodeBuffer(value) {
        return typeof Buffer !== 'undefined' && Buffer && typeof Buffer.isBuffer === 'function'
            && Buffer.isBuffer(value);
    }

    isPlainObject(value) {
        return value !== null && typeof value === 'object' && !this.isNodeBuffer(value)
            && !(value instanceof ArrayBuffer) && !ArrayBuffer.isView(value);
    }

    async networkRequest(urlString, options = {}) {
        const method = String(options.method || 'GET').toUpperCase();
        const headers = { ...(options.headers || {}) };
        const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
        const emitProgress = (event) => {
            if (!onProgress) return;
            try { onProgress(event); } catch (error) {
                console.warn('[YandexDisk] Progress callback failed:', error);
            }
        };

        if (this.isManualProxyEnabled()) {
            // Desktop strict behavior: manual mode never calls requestUrl and never retries directly.
            const body = this.toBuffer(options.body);
            if (body && !this.hasHeader(headers, 'content-length')) {
                headers['Content-Length'] = String(body.length);
            }
            this.getProxyConfig();
            return await this.manualProxyRequest(urlString, {
                method,
                headers,
                body,
                redirectCount: 0,
                onProgress,
            });
        }

        // Mobile and desktop system mode use only the public Obsidian API.
        // Do not set Content-Length manually: the mobile network stack owns it.
        this.deleteHeader(headers, 'content-length');
        try {
            emitProgress({ phase: 'transfer', loaded: 0, total: null, percent: null, indeterminate: true });
            const response = await requestUrl({
                url: urlString,
                method,
                headers,
                body: this.toRequestUrlBody(options.body),
                throw: false,
            });
            const normalized = {
                status: response.status,
                headers: this.normalizeHeaders(response.headers || {}),
                buffer: new Uint8Array(response.arrayBuffer || new ArrayBuffer(0)),
                url: urlString,
            };
            this.assertSuccessfulResponse(normalized);
            const total = this.binaryLength(normalized.buffer);
            emitProgress({ phase: 'transfer', loaded: total, total, percent: 100, indeterminate: false });
            return normalized;
        } catch (error) {
            if (error && error.status) throw error;
            const platform = this.t(this.isMobileRuntime() ? 'network.mobileWord' : 'network.systemWord');
            throw new Error(this.t('network.obsidianError', { platform, error: error.message || error }));
        }
    }

    async manualProxyRequest(urlString, state) {
        if (state.redirectCount > MAX_REDIRECTS) {
            throw new Error(this.t('network.tooManyRedirects', { max: MAX_REDIRECTS }));
        }

        const target = new URL(urlString);
        if (!['http:', 'https:'].includes(target.protocol)) {
            throw new Error(this.t('network.unsupportedProtocol', { protocol: target.protocol }));
        }

        const proxy = this.getProxyConfig();
        let response;
        if (proxy.type === 'socks5') {
            response = await this.requestThroughSocks5Proxy(target, proxy, state);
        } else {
            response = await this.requestThroughHttpProxy(target, proxy, state);
        }

        response.url = urlString;
        const location = this.getHeader(response.headers, 'location');
        if (this.isRedirect(response.status) && location) {
            const nextUrl = new URL(location, target).toString();
            const nextState = this.buildRedirectState(target, new URL(nextUrl), state, response.status);
            return await this.manualProxyRequest(nextUrl, nextState);
        }

        this.assertSuccessfulResponse(response);
        return response;
    }

    async requestThroughHttpProxy(target, proxy, state) {
        if (target.protocol === 'http:') {
            return await this.requestHttpTargetViaForwardProxy(target, proxy, state);
        }

        const tunnelSocket = await this.createHttpConnectTunnel(
            proxy,
            target.hostname,
            Number(target.port || 443)
        );
        const tlsSocket = await this.wrapTls(tunnelSocket, target.hostname);
        return await this.requestOnConnectedSocket(target, tlsSocket, state);
    }

    async requestHttpTargetViaForwardProxy(target, proxy, state) {
        const http = require('http');
        const https = require('https');
        const transport = proxy.type === 'https' ? https : http;
        const headers = {
            ...state.headers,
            Host: target.host,
            Connection: 'close',
            'Accept-Encoding': 'identity',
        };
        const proxyAuthorization = this.getProxyAuthorization(proxy);
        if (proxyAuthorization) headers['Proxy-Authorization'] = proxyAuthorization;

        return await this.performNodeRequest(transport, {
            protocol: proxy.type === 'https' ? 'https:' : 'http:',
            hostname: proxy.host,
            port: proxy.port,
            method: state.method,
            path: target.toString(),
            headers,
            servername: proxy.type === 'https' ? proxy.host : undefined,
        }, state.body, null, state.onProgress);
    }

    async createHttpConnectTunnel(proxy, targetHost, targetPort) {
        const http = require('http');
        const https = require('https');
        const transport = proxy.type === 'https' ? https : http;
        const headers = {
            Host: `${targetHost}:${targetPort}`,
            'Proxy-Connection': 'Keep-Alive',
        };
        const proxyAuthorization = this.getProxyAuthorization(proxy);
        if (proxyAuthorization) headers['Proxy-Authorization'] = proxyAuthorization;

        return await new Promise((resolve, reject) => {
            let settled = false;
            const finishReject = (error) => {
                if (settled) return;
                settled = true;
                reject(error);
            };

            const request = transport.request({
                hostname: proxy.host,
                port: proxy.port,
                method: 'CONNECT',
                path: `${targetHost}:${targetPort}`,
                headers,
                agent: false,
                servername: proxy.type === 'https' ? proxy.host : undefined,
            });

            request.setTimeout(this.getRequestTimeout(), () => {
                request.destroy(new Error(this.t('network.httpProxyTimeout')));
            });

            request.once('connect', (response, socket, head) => {
                if (settled) {
                    socket.destroy();
                    return;
                }
                if (response.statusCode !== 200) {
                    settled = true;
                    socket.destroy();
                    const suffix = response.statusCode === 407
                        ? this.t('network.proxyCredentialsHint')
                        : '';
                    reject(new Error(this.t('network.httpConnectError', { status: response.statusCode, suffix })));
                    return;
                }
                settled = true;
                socket.setTimeout(0);
                if (head && head.length) socket.unshift(head);
                resolve(socket);
            });

            request.once('response', (response) => {
                finishReject(new Error(this.t('network.proxyRejectedConnect', { status: response.statusCode })));
            });
            request.once('error', finishReject);
            request.end();
        });
    }

    async requestThroughSocks5Proxy(target, proxy, state) {
        const socket = await this.createSocks5Tunnel(
            proxy,
            target.hostname,
            Number(target.port || (target.protocol === 'https:' ? 443 : 80))
        );
        const connectedSocket = target.protocol === 'https:'
            ? await this.wrapTls(socket, target.hostname)
            : socket;
        return await this.requestOnConnectedSocket(target, connectedSocket, state);
    }

    async createSocks5Tunnel(proxy, targetHost, targetPort) {
        const net = require('net');
        const socket = await new Promise((resolve, reject) => {
            const client = net.connect({ host: proxy.host, port: proxy.port });
            const timer = setTimeout(() => {
                client.destroy(new Error(this.t('network.socksTimeout')));
            }, this.getRequestTimeout());
            client.once('connect', () => {
                clearTimeout(timer);
                resolve(client);
            });
            client.once('error', (error) => {
                clearTimeout(timer);
                reject(error);
            });
        });

        const reader = new SocketReader(socket, this.t('network.socksClosed'));
        try {
            const methods = proxy.auth ? [0x00, 0x02] : [0x00];
            await this.writeSocket(socket, Buffer.from([0x05, methods.length, ...methods]));
            const greeting = await reader.read(2);
            if (greeting[0] !== 0x05) throw new Error(this.t('network.socksVersion'));
            if (greeting[1] === 0xff) throw new Error(this.t('network.socksNoAuth'));

            if (greeting[1] === 0x02) {
                const username = Buffer.from(proxy.username, 'utf8');
                const password = Buffer.from(proxy.password, 'utf8');
                if (username.length > 255 || password.length > 255) {
                    throw new Error(this.t('network.socksCredentialsLong'));
                }
                await this.writeSocket(socket, Buffer.concat([
                    Buffer.from([0x01, username.length]),
                    username,
                    Buffer.from([password.length]),
                    password,
                ]));
                const authReply = await reader.read(2);
                if (authReply[1] !== 0x00) {
                    throw new Error(this.t('network.socksAuthRejected'));
                }
            } else if (greeting[1] !== 0x00) {
                throw new Error(this.t('network.socksAuthMethod', { method: greeting[1] }));
            }

            const hostBuffer = Buffer.from(targetHost, 'utf8');
            if (hostBuffer.length > 255) throw new Error(this.t('network.targetHostLong'));
            const portBuffer = Buffer.alloc(2);
            portBuffer.writeUInt16BE(targetPort, 0);
            await this.writeSocket(socket, Buffer.concat([
                Buffer.from([0x05, 0x01, 0x00, 0x03, hostBuffer.length]),
                hostBuffer,
                portBuffer,
            ]));

            const reply = await reader.read(4);
            if (reply[0] !== 0x05) throw new Error(this.t('network.socksReply'));
            if (reply[1] !== 0x00) {
                throw new Error(this.t('network.socksConnectError', { code: reply[1], description: this.describeSocksError(reply[1]) }));
            }

            const addressType = reply[3];
            if (addressType === 0x01) {
                await reader.read(4);
            } else if (addressType === 0x03) {
                const length = (await reader.read(1))[0];
                await reader.read(length);
            } else if (addressType === 0x04) {
                await reader.read(16);
            } else {
                throw new Error(this.t('network.socksAddressType', { type: addressType }));
            }
            await reader.read(2);
            reader.detach();
            socket.setTimeout(0);
            return socket;
        } catch (error) {
            reader.detach();
            socket.destroy();
            throw error;
        }
    }

    describeSocksError(code) {
        const messages = {
            0x01: this.t('socks.general'),
            0x02: this.t('socks.rules'),
            0x03: this.t('socks.network'),
            0x04: this.t('socks.host'),
            0x05: this.t('socks.refused'),
            0x06: this.t('socks.ttl'),
            0x07: this.t('socks.command'),
            0x08: this.t('socks.address'),
        };
        return messages[code] || this.t('socks.unknown');
    }

    async wrapTls(socket, servername) {
        const tls = require('tls');
        return await new Promise((resolve, reject) => {
            const tlsSocket = tls.connect({
                socket,
                servername,
                rejectUnauthorized: true,
            });
            const timer = setTimeout(() => {
                tlsSocket.destroy(new Error(this.t('network.tlsTimeout')));
            }, this.getRequestTimeout());
            tlsSocket.once('secureConnect', () => {
                clearTimeout(timer);
                resolve(tlsSocket);
            });
            tlsSocket.once('error', (error) => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }

    async requestOnConnectedSocket(target, socket, state) {
        const http = require('http');
        const headers = {
            ...state.headers,
            Host: target.host,
            Connection: 'close',
            'Accept-Encoding': 'identity',
        };

        const agent = new http.Agent({ keepAlive: false });
        agent.createConnection = () => socket;
        try {
            return await this.performNodeRequest(http, {
                hostname: target.hostname,
                port: Number(target.port || (target.protocol === 'https:' ? 443 : 80)),
                method: state.method,
                path: `${target.pathname}${target.search}`,
                headers,
                agent,
            }, state.body, socket, state.onProgress);
        } finally {
            agent.destroy();
        }
    }

    async performNodeRequest(transport, requestOptions, body, ownedSocket = null, onProgress = null) {
        return await new Promise((resolve, reject) => {
            let settled = false;
            const emitProgress = (event) => {
                if (!onProgress) return;
                try { onProgress(event); } catch (error) {
                    console.warn('[YandexDisk] Progress callback failed:', error);
                }
            };
            const request = transport.request(requestOptions, (response) => {
                const chunks = [];
                const rawTotal = Number(response.headers && response.headers['content-length']);
                const total = Number.isFinite(rawTotal) && rawTotal > 0 ? rawTotal : null;
                let loaded = 0;
                emitProgress({ phase: 'transfer', loaded, total, percent: total ? 0 : null, indeterminate: !total });
                response.on('data', (chunk) => {
                    const buffer = Buffer.from(chunk);
                    chunks.push(buffer);
                    loaded += buffer.length;
                    emitProgress({
                        phase: 'transfer',
                        loaded,
                        total,
                        percent: total ? Math.min(99, Math.round((loaded / total) * 100)) : null,
                        indeterminate: !total,
                    });
                });
                response.once('end', () => {
                    if (settled) return;
                    settled = true;
                    emitProgress({
                        phase: 'transfer',
                        loaded,
                        total: total || loaded,
                        percent: 100,
                        indeterminate: false,
                    });
                    resolve({
                        status: Number(response.statusCode || 0),
                        headers: this.normalizeHeaders(response.headers || {}),
                        buffer: Buffer.concat(chunks),
                    });
                });
                response.once('error', (error) => {
                    if (settled) return;
                    settled = true;
                    reject(error);
                });
            });

            request.setTimeout(this.getRequestTimeout(), () => {
                request.destroy(new Error(this.t('network.proxyRequestTimeout')));
            });
            request.once('error', (error) => {
                if (settled) return;
                settled = true;
                if (ownedSocket && !ownedSocket.destroyed) ownedSocket.destroy();
                reject(error);
            });
            if (body && body.length) request.write(body);
            request.end();
        });
    }

    buildRedirectState(previousUrl, nextUrl, state, status) {
        let method = state.method;
        let body = state.body;
        const headers = { ...state.headers };

        if (status === 303 || ((status === 301 || status === 302) && method === 'POST')) {
            method = 'GET';
            body = null;
            this.deleteHeader(headers, 'content-length');
            this.deleteHeader(headers, 'content-type');
        }

        if (previousUrl.origin !== nextUrl.origin) {
            this.deleteHeader(headers, 'authorization');
            this.deleteHeader(headers, 'cookie');
        }

        return {
            method,
            headers,
            body,
            redirectCount: state.redirectCount + 1,
            onProgress: state.onProgress,
        };
    }

    isRedirect(status) {
        return [301, 302, 303, 307, 308].includes(Number(status));
    }

    assertSuccessfulResponse(response) {
        if (response.status >= 200 && response.status < 300) return;
        const text = response.buffer ? this.binaryToText(response.buffer) : '';
        let details = text;
        try {
            const json = text ? JSON.parse(text) : {};
            details = json.message || json.description || json.error || text;
        } catch (_) {
            // Keep plain response body.
        }
        const error = new Error(`HTTP ${response.status}${details ? `: ${details}` : ''}`);
        error.status = response.status;
        error.responseBody = text;
        throw error;
    }

    getProxyAuthorization(proxy) {
        if (!proxy.auth) return null;
        return `Basic ${Buffer.from(`${proxy.username}:${proxy.password}`, 'utf8').toString('base64')}`;
    }

    normalizeHeaders(headers) {
        const normalized = {};
        for (const [key, value] of Object.entries(headers || {})) {
            normalized[String(key).toLowerCase()] = Array.isArray(value) ? value.join(', ') : String(value);
        }
        return normalized;
    }

    getHeader(headers, name) {
        return headers[String(name).toLowerCase()];
    }

    hasHeader(headers, name) {
        const target = String(name).toLowerCase();
        return Object.keys(headers).some((key) => key.toLowerCase() === target);
    }

    deleteHeader(headers, name) {
        const target = String(name).toLowerCase();
        for (const key of Object.keys(headers)) {
            if (key.toLowerCase() === target) delete headers[key];
        }
    }

    toBuffer(body) {
        if (body === undefined || body === null) return null;
        if (typeof Buffer === 'undefined') {
            throw new Error(this.t('network.bufferUnavailable'));
        }
        if (Buffer.isBuffer(body)) return body;
        if (body instanceof ArrayBuffer) return Buffer.from(body);
        if (ArrayBuffer.isView(body)) {
            return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        }
        if (typeof body === 'string') return Buffer.from(body, 'utf8');
        throw new Error(this.t('network.unsupportedBody'));
    }

    toRequestUrlBody(body) {
        if (body === undefined || body === null) return undefined;
        if (typeof body === 'string') return body;
        if (body instanceof ArrayBuffer) return body;
        if (ArrayBuffer.isView(body)) {
            return body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength);
        }
        throw new Error(this.t('network.unsupportedRequestUrlBody'));
    }

    binaryLength(binary) {
        if (binary === undefined || binary === null) return 0;
        if (binary instanceof ArrayBuffer) return binary.byteLength;
        if (ArrayBuffer.isView(binary)) return binary.byteLength;
        return Number(binary.length || 0);
    }

    binaryToText(binary) {
        if (binary === undefined || binary === null) return '';
        if (this.isNodeBuffer(binary)) return binary.toString('utf8');
        const bytes = binary instanceof ArrayBuffer
            ? new Uint8Array(binary)
            : new Uint8Array(binary.buffer, binary.byteOffset || 0, binary.byteLength);
        return new TextDecoder('utf-8').decode(bytes);
    }

    bufferToArrayBuffer(binary) {
        if (binary instanceof ArrayBuffer) return binary.slice(0);
        if (ArrayBuffer.isView(binary)) {
            return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
        }
        throw new Error(this.t('network.arrayBufferError'));
    }

    async writeSocket(socket, data) {
        await new Promise((resolve, reject) => {
            const onError = (error) => {
                socket.off('drain', onDrain);
                reject(error);
            };
            const onDrain = () => {
                socket.off('error', onError);
                resolve();
            };
            socket.once('error', onError);
            if (socket.write(data)) {
                socket.off('error', onError);
                resolve();
            } else {
                socket.once('drain', onDrain);
            }
        });
    }

    async getResources(path, limit, offset, sort) {
        const cacheKey = `${path}:${limit}:${offset}:${sort}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.time < this.settings.cacheTimeout) {
            return cached.data;
        }
        const data = await this.apiRequest('GET', '/resources', {
            path,
            limit,
            offset,
            sort,
            fields: 'name,path,type,size,modified,created,mime_type,media_type,md5,sha256,preview,file,public_url,resource_id,_embedded',
        });
        this.cache.set(cacheKey, { data, time: Date.now() });
        return data;
    }

    async getFilesList(limit, offset, mediaType) {
        const params = { limit, offset };
        if (mediaType) params.media_type = mediaType;
        return await this.apiRequest('GET', '/resources/files', params);
    }

    async getDownloadLink(path) {
        const data = await this.apiRequest('GET', '/resources/download', { path });
        return data.href;
    }

    async getFreshPreviewInfo(path) {
        return await this.apiRequest('GET', '/resources', {
            path,
            preview_size: 'L',
            preview_crop: 'false',
            fields: 'name,path,mime_type,media_type,preview,file',
        });
    }

    isImageContentType(contentType) {
        return String(contentType || '').toLowerCase().startsWith('image/');
    }

    async getImagePreviewResource(item) {
        const candidates = [];
        const seen = new Set();
        const addCandidate = (url, label) => {
            const normalized = String(url || '').trim();
            if (!normalized || seen.has(normalized)) return;
            seen.add(normalized);
            candidates.push({ url: normalized, label });
        };

        // The URL embedded in the directory listing may already be expired.
        addCandidate(item.preview, this.t('preview.source.list'));

        let metadataError = null;
        try {
            const fresh = await this.getFreshPreviewInfo(item.path);
            addCandidate(fresh.preview, this.t('preview.source.fresh'));
            addCandidate(fresh.file, this.t('preview.source.direct'));
        } catch (error) {
            metadataError = error;
        }

        let lastError = metadataError;
        for (const candidate of candidates) {
            try {
                const response = await this.getBinaryResource(candidate.url);
                const contentType = this.getHeader(response.headers, 'content-type')
                    || item.mime_type
                    || 'application/octet-stream';
                if (!this.isImageContentType(contentType)) {
                    throw new Error(this.t('network.imageContentType', { contentType }));
                }
                return {
                    response,
                    contentType,
                    sourceUrl: candidate.url,
                    sourceLabel: candidate.label,
                    usedDownloadFallback: false,
                };
            } catch (error) {
                lastError = error;
            }
        }

        // Reliable fallback: ask the API for a new temporary download URL and
        // render the original file. This is slower, but avoids stale preview URLs.
        try {
            const downloadUrl = await this.getDownloadLink(item.path);
            const response = await this.getBinaryResource(downloadUrl);
            const contentType = this.getHeader(response.headers, 'content-type')
                || item.mime_type
                || 'application/octet-stream';
            if (!this.isImageContentType(contentType)) {
                throw new Error(this.t('network.downloadImageContentType', { contentType }));
            }
            return {
                response,
                contentType,
                sourceUrl: downloadUrl,
                sourceLabel: this.t('preview.source.download'),
                usedDownloadFallback: true,
            };
        } catch (error) {
            lastError = error;
        }

        throw lastError || new Error(this.t('network.noImageUrl'));
    }

    async getUploadUrl(path, overwrite) {
        const data = await this.apiRequest('GET', '/resources/upload', {
            path,
            overwrite: String(overwrite),
        });
        return data.href;
    }

    async createFolder(path) {
        return await this.apiRequest('PUT', '/resources', { path });
    }

    async deleteResource(path, permanently) {
        return await this.apiRequest('DELETE', '/resources', {
            path,
            permanently: permanently ? 'true' : 'false',
        });
    }

    async moveResource(from, to) {
        return await this.apiRequest('POST', '/resources/move', { from, path: to });
    }

    async copyResource(from, to) {
        return await this.apiRequest('POST', '/resources/copy', { from, path: to });
    }

    async publishResource(path) {
        return await this.apiRequest('PUT', '/resources/publish', { path });
    }

    async unpublishResource(path) {
        return await this.apiRequest('PUT', '/resources/unpublish', { path });
    }

    async getPublicResources() {
        return await this.apiRequest('GET', '/resources/public');
    }

    async getDiskInfo() {
        return await this.apiRequest('GET', '');
    }

    async downloadToVault(remotePath, localPath, options = {}) {
        if (!this.settings.enableDownloads) {
            new Notice(this.t('download.disabled'));
            return;
        }

        const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
        const emitProgress = (event) => {
            if (!onProgress) return;
            try { onProgress(event); } catch (error) {
                console.warn('[YandexDisk] Progress callback failed:', error);
            }
        };

        const fileName = remotePath.split('/').pop();
        emitProgress({ phase: 'link', percent: null, indeterminate: true });
        const downloadUrl = await this.getDownloadLink(remotePath);
        const destPath = normalizePath(localPath || `${this.settings.downloadFolder}/${fileName}`);
        await this.ensureVaultFolder(destPath);

        emitProgress({ phase: 'download', percent: null, indeterminate: true });
        const arrayBuffer = await this.downloadWithProxy(downloadUrl, (event) => {
            emitProgress({ ...event, phase: 'download' });
        });

        emitProgress({ phase: 'saving', percent: 99, indeterminate: true });
        const existing = this.app.vault.getAbstractFileByPath(destPath);
        if (existing) {
            await this.app.vault.modifyBinary(existing, arrayBuffer);
        } else {
            await this.app.vault.createBinary(destPath, arrayBuffer);
        }

        emitProgress({
            phase: 'complete',
            loaded: arrayBuffer.byteLength,
            total: arrayBuffer.byteLength,
            percent: 100,
            indeterminate: false,
        });
        return destPath;
    }

    async ensureVaultFolder(filePath) {
        const slashIndex = filePath.lastIndexOf('/');
        if (slashIndex < 1) return;
        const folderPath = filePath.slice(0, slashIndex);
        const segments = folderPath.split('/').filter(Boolean);
        let current = '';
        for (const segment of segments) {
            current = current ? `${current}/${segment}` : segment;
            if (!this.app.vault.getAbstractFileByPath(current)) {
                await this.app.vault.createFolder(current);
            }
        }
    }

    async getBinaryResource(urlString, onProgress = null) {
        return await this.networkRequest(urlString, {
            method: 'GET',
            headers: { Accept: '*/*' },
            onProgress,
        });
    }

    async downloadWithProxy(urlString, onProgress = null) {
        const response = await this.getBinaryResource(urlString, onProgress);
        return this.bufferToArrayBuffer(response.buffer);
    }

    async uploadFromVault(localFile, remotePath) {
        if (!this.settings.enableUploads) {
            new Notice(this.t('upload.disabled'));
            return;
        }

        const file = this.app.vault.getAbstractFileByPath(localFile);
        if (!file || !(file instanceof TFile)) {
            new Notice(this.t('file.notFound'));
            return;
        }

        const destPath = remotePath || `disk:/${file.name}`;
        const uploadUrl = await this.getUploadUrl(destPath, true);
        const content = await this.app.vault.readBinary(file);
        const contentType = file.extension === 'md' ? 'text/markdown' : 'application/octet-stream';
        await this.uploadWithProxy(uploadUrl, content, contentType);

        new Notice(this.t('notice.uploaded', { name: file.name }));
        this.clearCache();
    }

    async uploadWithProxy(urlString, data, contentType) {
        await this.networkRequest(urlString, {
            method: 'PUT',
            headers: { 'Content-Type': contentType || 'application/octet-stream' },
            body: data,
        });
    }

    clearCache() {
        if (this.cache) this.cache.clear();
    }

    async loadSettings() {
        const saved = (await this.loadData()) || {};
        const migrated = { ...saved };

        // Migration from v1.1 settings.
        if (!migrated.networkMode) {
            migrated.networkMode = migrated.useProxy ? 'manual' : 'system';
        }
        if (migrated.requestTimeout === undefined) migrated.requestTimeout = 30000;
        if (!['ru', 'en'].includes(migrated.language)) migrated.language = 'ru';

        this.settings = Object.assign({}, DEFAULT_SETTINGS, migrated);
        this.settings.pageSize = Math.min(100, Math.max(10, Number(this.settings.pageSize) || 20));
        this.settings.proxyPort = Number(this.settings.proxyPort) || 8080;
        this.settings.requestTimeout = Number(this.settings.requestTimeout) || 30000;
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.clearCache();
        for (const view of this.getExplorerViews()) {
            if (view && typeof view.updateProxyStatus === 'function') {
                view.updateProxyStatus();
            }
        }
    }

    onunload() {
        this.clearCache();
        if (this.explorerViews) this.explorerViews.clear();
    }
}

class SocketReader {
    constructor(socket, closeErrorMessage = 'SOCKS5 proxy connection closed during handshake.') {
        this.socket = socket;
        this.closeErrorMessage = closeErrorMessage;
        this.buffer = Buffer.alloc(0);
        this.waiters = [];
        this.error = null;
        this.onData = (chunk) => {
            this.buffer = Buffer.concat([this.buffer, Buffer.from(chunk)]);
            this.flush();
        };
        this.onError = (error) => {
            this.error = error;
            this.flush();
        };
        this.onClose = () => {
            if (!this.error) this.error = new Error(this.closeErrorMessage);
            this.flush();
        };
        socket.on('data', this.onData);
        socket.once('error', this.onError);
        socket.once('close', this.onClose);
    }

    read(length) {
        if (this.error) return Promise.reject(this.error);
        if (this.buffer.length >= length) return Promise.resolve(this.take(length));
        return new Promise((resolve, reject) => {
            this.waiters.push({ length, resolve, reject });
        });
    }

    take(length) {
        const result = this.buffer.subarray(0, length);
        this.buffer = this.buffer.subarray(length);
        return result;
    }

    flush() {
        if (this.error) {
            while (this.waiters.length) this.waiters.shift().reject(this.error);
            return;
        }
        while (this.waiters.length && this.buffer.length >= this.waiters[0].length) {
            const waiter = this.waiters.shift();
            waiter.resolve(this.take(waiter.length));
        }
    }

    detach() {
        this.socket.off('data', this.onData);
        this.socket.off('error', this.onError);
        this.socket.off('close', this.onClose);
        if (this.buffer.length) this.socket.unshift(this.buffer);
        this.buffer = Buffer.alloc(0);
        while (this.waiters.length) {
            this.waiters.shift().reject(new Error('SOCKS5 reader detached.'));
        }
    }
}


// ===== VIEW =====
class YandexDiskExplorerView extends require('obsidian').ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.currentPath = plugin.settings.rootPath;
        this.breadcrumbs = [plugin.settings.rootPath];
        this.items = [];
        this.offset = 0;
        this.limit = plugin.settings.pageSize;
        this.total = 0;
        this.sort = plugin.settings.defaultSort;
        this.loading = false;
        this.itemRows = new Map();
        this.activeDownloads = new Set();
        this.operationSequence = 0;
        this.currentOperationId = 0;
        this.operationHideTimer = null;
        this.lastDirectoryData = null;
        this.plugin.registerExplorerView(this);
    }

    t(key, vars = {}) { return this.plugin.t(key, vars); }
    getViewType() { return VIEW_TYPE; }
    getDisplayText() { return this.t('view.title'); }
    getIcon() { return 'cloud'; }

    async refreshLanguage() {
        const searchValue = this.searchInput ? this.searchInput.value : '';
        this.containerEl.empty();
        this.containerEl.addClass('aimeton-cloud-bridge');
        this.addStyles();
        this.buildUI();

        if (!this.plugin.settings.oauthToken) {
            this.showSetupMessage();
            return;
        }

        // Repaint already loaded data immediately. This avoids a blank panel,
        // a network round-trip, and the mobile workspace timing issue.
        if (this.lastDirectoryData) {
            this.renderDirectoryData(this.lastDirectoryData);
        } else if (this.loading) {
            this.fileListEl.empty();
            this.fileListEl.createDiv('yd-loading', (el) => {
                el.textContent = this.t('loading');
            });
        } else {
            await this.loadDirectory(this.currentPath);
        }

        if (searchValue && this.searchInput) {
            this.searchInput.value = searchValue;
            this.filterItems(searchValue);
        }

        try {
            if (this.leaf && typeof this.leaf.updateHeader === 'function') {
                this.leaf.updateHeader();
            }
        } catch (_) {}
    }

    async onOpen() {
        this.plugin.registerExplorerView(this);
        this.containerEl.empty();
        this.containerEl.addClass('aimeton-cloud-bridge');
        this.addStyles();
        this.buildUI();

        if (this.plugin.settings.oauthToken) {
            await this.loadDirectory(this.currentPath);
        } else {
            this.showSetupMessage();
        }
    }

    async onClose() {
        this.plugin.unregisterExplorerView(this);
        if (this.operationHideTimer) clearTimeout(this.operationHideTimer);
    }

    addStyles() {
        if (document.getElementById('yd-explorer-inline-styles')) return;
        const style = document.createElement('style');
        style.id = 'yd-explorer-inline-styles';
        style.textContent = `
            .aimeton-cloud-bridge { padding: 0; overflow-y: auto; height: 100%; font-size: 14px; }
            .yd-header { padding: 12px 16px; border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary); position: sticky; top: 0; z-index: 10; }
            .yd-breadcrumbs { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; font-size: 12px; }
            .yd-breadcrumb-item { color: var(--text-accent); cursor: pointer; padding: 2px 6px; border-radius: 4px; }
            .yd-breadcrumb-item:hover { background: var(--background-modifier-hover); }
            .yd-breadcrumb-sep { color: var(--text-muted); }
            .yd-toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
            .yd-toolbar button { padding: 4px 10px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; }
            .yd-toolbar button:hover { background: var(--background-modifier-hover); }
            .yd-toolbar button:disabled { opacity: 0.5; cursor: not-allowed; }
            .yd-search-box { flex: 1; min-width: 120px; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); font-size: 12px; }
            .yd-file-list { padding: 8px 0; }
            .yd-item { display: flex; align-items: center; padding: 6px 16px; gap: 10px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--background-modifier-border-hover); }
            .yd-item:hover { background: var(--background-modifier-hover); }
            .yd-item.selected { background: var(--background-modifier-active-hover); }
            .yd-item-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
            .yd-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
            .yd-item-name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .yd-item-meta { font-size: 11px; color: var(--text-muted); display: flex; gap: 8px; }
            .yd-item-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
            .yd-item:hover .yd-item-actions { opacity: 1; }
            .yd-item-actions button { padding: 2px 6px; font-size: 11px; border-radius: 3px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); cursor: pointer; }
            .yd-item-actions button:hover { background: var(--text-accent); color: var(--text-on-accent); }
            .yd-folder-icon { color: #f4b400; }
            .yd-file-icon { color: var(--text-muted); }
            .yd-image-icon { color: #34a853; }
            .yd-audio-icon { color: #ea4335; }
            .yd-video-icon { color: #4285f4; }
            .yd-doc-icon { color: #4285f4; }
            .yd-archive-icon { color: #9aa0a6; }
            .yd-empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
            .yd-loading { text-align: center; padding: 20px; color: var(--text-muted); }
            .yd-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px; border-top: 1px solid var(--background-modifier-border); }
            .yd-pagination button { padding: 4px 12px; }
            .yd-context-menu { position: absolute; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 100; min-width: 160px; padding: 4px 0; }
            .yd-context-menu-item { padding: 8px 16px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; }
            .yd-context-menu-item:hover { background: var(--background-modifier-hover); }
            .yd-context-menu-sep { height: 1px; background: var(--background-modifier-border); margin: 4px 0; }
            .yd-preview-modal img { max-width: 100%; max-height: 70vh; border-radius: 8px; }
            .yd-drop-zone { border: 2px dashed var(--background-modifier-border); border-radius: 8px; padding: 20px; text-align: center; margin: 8px 16px; color: var(--text-muted); transition: all 0.2s; }
            .yd-drop-zone.drag-over { border-color: var(--text-accent); background: var(--background-modifier-hover); }
            .yd-disk-info { padding: 8px 16px; font-size: 11px; color: var(--text-muted); border-bottom: 1px solid var(--background-modifier-border); display: flex; justify-content: space-between; }
            .yd-operation-status { display: none; padding: 9px 16px 10px; border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary); }
            .yd-operation-status.visible { display: block; }
            .yd-operation-head { display: flex; align-items: center; gap: 9px; min-width: 0; }
            .yd-operation-spinner { width: 16px; height: 16px; flex: 0 0 auto; border: 2px solid var(--background-modifier-border); border-top-color: var(--text-accent); border-radius: 50%; animation: yd-spin 0.85s linear infinite; }
            .yd-operation-status.complete .yd-operation-spinner { animation: none; border: none; width: auto; height: auto; }
            .yd-operation-status.error .yd-operation-spinner { animation: none; border: none; width: auto; height: auto; }
            .yd-operation-text { flex: 1; min-width: 0; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .yd-operation-percent { font-size: 12px; font-variant-numeric: tabular-nums; color: var(--text-muted); }
            .yd-operation-dismiss { margin-left: 2px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-muted); border-radius: 6px; min-width: 24px; height: 24px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; font-size: 15px; }
            .yd-operation-dismiss:hover { background: var(--background-modifier-hover); color: var(--text-normal); }
            .yd-operation-detail { margin: 4px 0 6px 25px; font-size: 11px; color: var(--text-muted); min-height: 14px; }
            .yd-progress-bar { width: 100%; height: 4px; background: var(--background-modifier-border); position: relative; overflow: hidden; border-radius: 999px; }
            .yd-progress-bar-fill { height: 100%; width: 0%; background: var(--text-accent); transition: width 0.25s ease; border-radius: inherit; }
            .yd-progress-bar.indeterminate .yd-progress-bar-fill { width: 38% !important; animation: yd-indeterminate 1.15s ease-in-out infinite; }
            .yd-item.is-busy { background: var(--background-modifier-hover); }
            .yd-item.is-busy .yd-item-actions button { pointer-events: none; opacity: 0.45; }
            .yd-item-operation { display: none; margin-top: 2px; font-size: 11px; color: var(--text-accent); }
            .yd-item-operation.visible { display: block; }
            .yd-item-operation.success { color: var(--text-success); }
            .yd-item-operation.error { color: var(--text-error); }
            @keyframes yd-spin { to { transform: rotate(360deg); } }
            @keyframes yd-indeterminate { 0% { transform: translateX(-120%); } 50% { transform: translateX(125%); } 100% { transform: translateX(280%); } }
            .yd-proxy-status { padding: 4px 16px; font-size: 11px; border-bottom: 1px solid var(--background-modifier-border); display: flex; align-items: center; gap: 6px; }
            .yd-proxy-status.ok { color: var(--text-success); }
            .yd-proxy-status.warn { color: var(--text-warning); }
            .yd-proxy-status.error { color: var(--text-error); }
            .yd-proxy-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
            .yd-proxy-badge.system { background: var(--background-modifier-success); color: var(--text-success); }
            .yd-proxy-badge.manual { background: var(--background-modifier-border); color: var(--text-accent); }
            .yd-proxy-badge.mobile { background: var(--background-modifier-success); color: var(--text-success); }
            .yd-proxy-badge.none { background: var(--background-modifier-border); color: var(--text-muted); }
        `;
        document.head.appendChild(style);
    }

    buildUI() {
        const container = this.containerEl;

        this.headerEl = container.createDiv('yd-header');
        this.buildBreadcrumbs();
        this.buildToolbar();

        this.proxyStatusEl = container.createDiv('yd-proxy-status');
        this.updateProxyStatus();

        this.diskInfoEl = container.createDiv('yd-disk-info');

        this.operationEl = container.createDiv('yd-operation-status');
        const operationHead = this.operationEl.createDiv('yd-operation-head');
        this.operationSpinnerEl = operationHead.createDiv('yd-operation-spinner');
        this.operationTextEl = operationHead.createDiv('yd-operation-text');
        this.operationPercentEl = operationHead.createDiv('yd-operation-percent');
        this.operationDismissBtn = operationHead.createEl('button', {
            cls: 'yd-operation-dismiss',
            text: '×',
        });
        this.operationDismissBtn.type = 'button';
        this.operationDismissBtn.setAttribute('aria-label', this.t('common.dismiss'));
        this.operationDismissBtn.setAttribute('title', this.t('common.dismiss'));
        this.operationDismissBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.hideProgress();
        });
        this.operationEl.addEventListener('click', (event) => {
            if (event.target === this.operationDismissBtn) return;
            if (this.operationEl.classList.contains('error') || this.operationEl.classList.contains('complete')) {
                this.hideProgress();
            }
        });
        this.operationDetailEl = this.operationEl.createDiv('yd-operation-detail');
        this.progressEl = this.operationEl.createDiv('yd-progress-bar');
        this.progressFillEl = this.progressEl.createDiv('yd-progress-bar-fill');

        this.fileListEl = container.createDiv('yd-file-list');
        this.paginationEl = container.createDiv('yd-pagination');

        if (this.plugin.settings.enableUploads) {
            this.dropZoneEl = container.createDiv('yd-drop-zone');
            this.dropZoneEl.textContent = this.t('dropzone');
            this.setupDropZone();
        }

    }

    updateProxyStatus() {
        if (!this.proxyStatusEl) return;
        const mode = this.plugin.getEffectiveNetworkMode();
        const manual = mode === 'manual';
        const mobile = mode === 'mobile-system';
        this.proxyStatusEl.empty();
        const badgeClass = mobile ? 'mobile' : (manual ? 'manual' : 'system');
        const badge = this.proxyStatusEl.createSpan(`yd-proxy-badge ${badgeClass}`);
        badge.textContent = mobile
            ? this.t('network.mobileBadge')
            : (manual ? this.t('network.manualBadge', { proxy: this.plugin.getProxyLabel() }) : this.t('network.systemBadge'));
        this.proxyStatusEl.className = `yd-proxy-status ${manual || mobile ? 'ok' : 'warn'}`;
        this.proxyStatusEl.title = mobile
            ? this.t('network.mobileHelp')
            : (manual
                ? this.t('network.manualHelp')
                : this.t('network.systemHelp'));
    }

    buildBreadcrumbs() {
        this.breadcrumbsEl = this.headerEl.createDiv('yd-breadcrumbs');
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        this.breadcrumbsEl.empty();
        this.breadcrumbs.forEach((crumb, index) => {
            if (index > 0) {
                const sep = this.breadcrumbsEl.createSpan('yd-breadcrumb-sep');
                sep.textContent = '/';
            }
            const item = this.breadcrumbsEl.createSpan('yd-breadcrumb-item');
            const name = crumb === 'disk:/' ? this.t('root.disk') : crumb.split('/').pop() || crumb;
            item.textContent = name;
            item.addEventListener('click', () => {
                this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
                this.currentPath = crumb;
                this.offset = 0;
                this.loadDirectory(crumb);
            });
        });
    }

    buildToolbar() {
        const toolbar = this.headerEl.createDiv('yd-toolbar');

        const refreshBtn = toolbar.createEl('button');
        refreshBtn.innerHTML = '🔄';
        refreshBtn.title = this.t('toolbar.refresh');
        refreshBtn.addEventListener('click', () => {
            this.plugin.clearCache();
            this.loadDirectory(this.currentPath);
        });

        const upBtn = toolbar.createEl('button');
        upBtn.innerHTML = '⬆️';
        upBtn.title = this.t('toolbar.up');
        upBtn.addEventListener('click', () => this.goUp());

        const newFolderBtn = toolbar.createEl('button');
        newFolderBtn.innerHTML = '📁+';
        newFolderBtn.title = this.t('toolbar.newFolder');
        newFolderBtn.addEventListener('click', () => this.createNewFolder());

        const sortSelect = toolbar.createEl('select');
        sortSelect.style.cssText = 'padding: 4px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); font-size: 12px;';
        [
            { value: 'name', label: this.t('toolbar.sort.nameAsc') },
            { value: '-name', label: this.t('toolbar.sort.nameDesc') },
            { value: 'modified', label: this.t('toolbar.sort.dateAsc') },
            { value: '-modified', label: this.t('toolbar.sort.dateDesc') },
            { value: 'size', label: this.t('toolbar.sort.sizeAsc') },
            { value: '-size', label: this.t('toolbar.sort.sizeDesc') },
        ].forEach(opt => {
            const option = sortSelect.createEl('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === this.sort) option.selected = true;
        });
        sortSelect.addEventListener('change', (e) => {
            this.sort = e.target.value;
            this.offset = 0;
            this.loadDirectory(this.currentPath);
        });

        this.searchInput = toolbar.createEl('input', 'yd-search-box');
        this.searchInput.placeholder = this.t('toolbar.search');
        this.searchInput.addEventListener('input', (e) => {
            this.filterItems(e.target.value);
        });

        if (this.plugin.settings.enableUploads) {
            const uploadBtn = toolbar.createEl('button');
            uploadBtn.innerHTML = `📤 ${this.t('toolbar.upload')}`;
            uploadBtn.addEventListener('click', () => this.showUploadDialog());
        }
    }

    async loadDirectory(path) {
        if (this.loading) return;
        this.loading = true;
        this.itemRows.clear();

        this.fileListEl.empty();
        this.fileListEl.createDiv('yd-loading', (el) => {
            el.textContent = this.t('loading');
        });

        try {
            const data = await this.plugin.getResources(path, this.limit, this.offset, this.sort);
            this.lastDirectoryData = data;
            this.renderDirectoryData(data);

        } catch (error) {
            this.fileListEl.empty();
            const msg = error.message || '';
            const isProxyError = msg.includes('tunnel') || msg.includes('proxy') || msg.includes('Connection') || msg.includes('ETIMEDOUT') || msg.includes('ECONNREFUSED');

            this.fileListEl.createDiv('yd-empty-state', (el) => {
                if (isProxyError) {
                    el.innerHTML = `🔒<br>${this.t('error.connection')}<br><small style="color:var(--text-error)">${msg}</small><br><br><button id="yd-open-proxy-settings" style="padding:6px 12px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);cursor:pointer;">${this.t('action.openProxySettings')}</button>`;
                    setTimeout(() => {
                        const btn = document.getElementById('yd-open-proxy-settings');
                        if (btn) btn.addEventListener('click', () => {
                            this.app.setting.open();
                            this.app.setting.openTabById('aimeton-cloud-bridge');
                        });
                    }, 50);
                } else {
                    el.innerHTML = `❌<br>${this.t('error.loading')}<br><small>${msg || this.t('error.checkToken')}</small>`;
                }
            });
        } finally {
            this.loading = false;
        }
    }

    renderDirectoryData(data) {
        this.itemRows.clear();
        this.items = data && data._embedded && Array.isArray(data._embedded.items)
            ? data._embedded.items
            : [];
        this.total = data && data._embedded && Number.isFinite(Number(data._embedded.total))
            ? Number(data._embedded.total)
            : 0;

        this.fileListEl.empty();
        if (this.items.length === 0) {
            this.fileListEl.createDiv('yd-empty-state', (el) => {
                el.innerHTML = `📂<br>${this.t('folder.empty')}`;
            });
        } else {
            this.items.forEach((item) => this.renderItem(item));
        }

        this.updatePagination();
        this.updateDiskInfo(data || {});
        this.updateProxyStatus();
    }

    renderItem(item) {
        const el = this.fileListEl.createDiv('yd-item');
        el.dataset.path = item.path;
        el.dataset.type = item.type;

        const iconEl = el.createDiv('yd-item-icon');
        iconEl.innerHTML = this.getItemIcon(item);

        const infoEl = el.createDiv('yd-item-info');
        const nameEl = infoEl.createDiv('yd-item-name');
        nameEl.textContent = item.name;

        const metaEl = infoEl.createDiv('yd-item-meta');
        const parts = [];
        if (item.type === 'dir') {
            parts.push(this.t('common.folder'));
        } else {
            parts.push(this.formatSize(item.size));
            if (item.mime_type) parts.push(item.mime_type.split('/').pop());
        }
        if (item.modified) parts.push(this.formatDate(item.modified));
        metaEl.textContent = parts.join(' • ');

        const operationEl = infoEl.createDiv('yd-item-operation');
        const actionsEl = el.createDiv('yd-item-actions');
        this.itemRows.set(item.path, { el, operationEl, actionsEl });

        if (item.type === 'file') {
            if (this.plugin.settings.enableDownloads) {
                const dlBtn = actionsEl.createEl('button');
                dlBtn.innerHTML = '⬇️';
                dlBtn.title = this.t('action.downloadVault');
                dlBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.downloadFile(item);
                });
            }

            if (item.media_type === 'image' && item.preview) {
                const previewBtn = actionsEl.createEl('button');
                previewBtn.innerHTML = '👁️';
                previewBtn.title = this.t('action.preview');
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPreview(item);
                });
            }

            if (item.public_url) {
                const pubBtn = actionsEl.createEl('button');
                pubBtn.innerHTML = '🔗';
                pubBtn.title = this.t('action.copyPublicLink');
                pubBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.public_url);
                    new Notice(this.t('notice.linkCopied'));
                });
            }
        }

        el.addEventListener('click', () => {
            if (item.type === 'dir') {
                this.navigateTo(item.path);
            }
        });

        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(item, e.clientX, e.clientY);
        });

        el.addEventListener('dblclick', () => {
            if (item.type === 'file') this.downloadFile(item);
        });
    }

    getItemIcon(item) {
        if (item.type === 'dir') return '<span class="yd-folder-icon">📁</span>';
        const mt = item.media_type || '';
        const mime = item.mime_type || '';
        if (mt === 'image' || mime.startsWith('image/')) return '<span class="yd-image-icon">🖼️</span>';
        if (mt === 'audio' || mime.startsWith('audio/')) return '<span class="yd-audio-icon">🎵</span>';
        if (mt === 'video' || mime.startsWith('video/')) return '<span class="yd-video-icon">🎬</span>';
        if (mt === 'document' || mime.includes('pdf') || mime.includes('word') || mime.includes('excel')) return '<span class="yd-doc-icon">📄</span>';
        if (mt === 'compressed' || mime.includes('zip') || mime.includes('rar') || mime.includes('tar')) return '<span class="yd-archive-icon">📦</span>';
        return '<span class="yd-file-icon">📄</span>';
    }

    formatSize(bytes) {
        if (!bytes) return this.plugin.getLanguage() === 'ru' ? '0 Б' : '0 B';
        const units = this.plugin.getLanguage() === 'ru'
            ? ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ']
            : ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let i = 0;
        while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
        return size.toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString(this.plugin.getLocale(), {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    navigateTo(path) {
        this.currentPath = path;
        this.breadcrumbs.push(path);
        this.offset = 0;
        this.updateBreadcrumbs();
        this.loadDirectory(path);
    }

    goUp() {
        if (this.breadcrumbs.length <= 1) return;
        this.breadcrumbs.pop();
        this.currentPath = this.breadcrumbs[this.breadcrumbs.length - 1];
        this.offset = 0;
        this.updateBreadcrumbs();
        this.loadDirectory(this.currentPath);
    }

    updatePagination() {
        this.paginationEl.empty();
        const hasPrev = this.offset > 0;
        const hasNext = this.offset + this.limit < this.total;

        const prevBtn = this.paginationEl.createEl('button');
        prevBtn.textContent = this.t('pagination.back');
        prevBtn.disabled = !hasPrev;
        prevBtn.addEventListener('click', () => {
            this.offset = Math.max(0, this.offset - this.limit);
            this.loadDirectory(this.currentPath);
        });

        const info = this.paginationEl.createSpan();
        const start = this.total > 0 ? this.offset + 1 : 0;
        const end = Math.min(this.offset + this.limit, this.total);
        info.textContent = this.t('common.range', { start, end, total: this.total });
        info.style.color = 'var(--text-muted)';
        info.style.fontSize = '12px';

        const nextBtn = this.paginationEl.createEl('button');
        nextBtn.textContent = this.t('pagination.next');
        nextBtn.disabled = !hasNext;
        nextBtn.addEventListener('click', () => {
            this.offset += this.limit;
            this.loadDirectory(this.currentPath);
        });
    }

    updateDiskInfo(data) {
        this.diskInfoEl.empty();
        const left = this.diskInfoEl.createSpan();
        left.textContent = '📂 ' + this.currentPath;
        const right = this.diskInfoEl.createSpan();
        if (this.total > 0) right.textContent = this.t('common.items', { count: this.total });
    }

    filterItems(query) {
        const items = this.fileListEl.querySelectorAll('.yd-item');
        const lowerQuery = query.toLowerCase();
        items.forEach(el => {
            const name = el.querySelector('.yd-item-name').textContent.toLowerCase();
            el.style.display = name.includes(lowerQuery) ? '' : 'none';
        });
    }

    async downloadFile(item) {
        if (!item || !item.path) return;
        if (this.activeDownloads.has(item.path)) {
            new Notice(this.t('download.already', { name: item.name }));
            return;
        }

        this.activeDownloads.add(item.path);
        const operationId = this.beginOperation(this.t('download.title', { name: item.name }), {
            detail: item.size ? this.t('download.fileSize', { size: this.formatSize(item.size) }) : this.t('download.prepareLink'),
            indeterminate: true,
        });
        this.setItemOperation(item.path, this.t('download.preparing'), 'busy');
        new Notice(this.t('download.started', { name: item.name }));

        const startedAt = Date.now();
        let latestProgress = null;
        const elapsedTimer = window.setInterval(() => {
            if (!this.activeDownloads.has(item.path)) return;
            const elapsed = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
            if (!latestProgress || latestProgress.indeterminate || latestProgress.percent === null) {
                const sizeText = item.size ? `${this.formatSize(item.size)} • ` : '';
                this.updateOperation(operationId, {
                    detail: `${sizeText}${this.t('common.secondsElapsed', { seconds: elapsed })}`,
                    indeterminate: true,
                });
            }
        }, 1000);

        try {
            const destPath = await this.plugin.downloadToVault(item.path, null, {
                onProgress: (progress) => {
                    latestProgress = progress || {};
                    const phase = progress.phase || 'download';
                    if (phase === 'link') {
                        this.updateOperation(operationId, {
                            text: this.t('download.getLinkTitle', { name: item.name }),
                            detail: this.t('download.getLinkDetail'),
                            indeterminate: true,
                        });
                        this.setItemOperation(item.path, this.t('download.getLinkRow'), 'busy');
                        return;
                    }
                    if (phase === 'saving') {
                        this.updateOperation(operationId, {
                            text: this.t('download.savingTitle', { name: item.name }),
                            detail: this.t('download.savingDetail'),
                            percent: 99,
                            indeterminate: true,
                        });
                        this.setItemOperation(item.path, this.t('download.savingRow'), 'busy');
                        return;
                    }
                    if (phase === 'complete') return;

                    const percent = Number.isFinite(progress.percent) ? progress.percent : null;
                    const hasTotal = Number.isFinite(progress.total) && progress.total > 0;
                    const loadedText = Number.isFinite(progress.loaded) ? this.formatSize(progress.loaded) : '';
                    const totalText = hasTotal ? this.formatSize(progress.total) : (item.size ? this.formatSize(item.size) : '');
                    const detail = loadedText && totalText
                        ? this.t('common.of', { loaded: loadedText, total: totalText })
                        : (totalText ? this.t('common.size', { size: totalText }) : this.t('download.receiving'));

                    this.updateOperation(operationId, {
                        text: this.t('download.title', { name: item.name }),
                        detail,
                        percent,
                        indeterminate: progress.indeterminate || percent === null,
                    });
                    this.setItemOperation(
                        item.path,
                        percent === null ? this.t('download.row') : this.t('download.rowPercent', { percent }),
                        'busy'
                    );
                },
            });

            this.completeOperation(operationId, this.t('download.doneTitle', { name: item.name }), this.t('download.savedPath', { path: destPath }));
            this.setItemOperation(item.path, this.t('download.doneRow'), 'success');
            new Notice(this.t('download.doneTitle', { name: item.name }));
            window.setTimeout(() => this.clearItemOperation(item.path), 2500);
        } catch (error) {
            this.failOperation(operationId, this.t('download.errorTitle', { name: item.name }), error.message || String(error));
            this.setItemOperation(item.path, this.t('download.errorRow'), 'error');
            new Notice(this.t('download.errorNotice', { error: error.message || error }));
            window.setTimeout(() => this.clearItemOperation(item.path), 4000);
        } finally {
            window.clearInterval(elapsedTimer);
            this.activeDownloads.delete(item.path);
        }
    }

    async showPreview(item) {
        if (!item || !item.path) {
            new Notice(this.t('preview.noPath'));
            return;
        }

        const modal = new Modal(this.app);
        modal.titleEl.textContent = item.name;
        const content = modal.contentEl.createDiv('yd-preview-modal');
        const loading = content.createDiv('yd-loading');
        loading.textContent = this.plugin.isManualProxyEnabled()
            ? this.t('preview.loadingProxy')
            : this.t('preview.loading');
        modal.open();

        let objectUrl = null;
        const originalOnClose = modal.onClose ? modal.onClose.bind(modal) : null;
        modal.onClose = () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            if (originalOnClose) originalOnClose();
        };

        try {
            const loaded = await this.plugin.getImagePreviewResource(item);
            const blob = new Blob(
                [this.plugin.bufferToArrayBuffer(loaded.response.buffer)],
                { type: loaded.contentType }
            );
            objectUrl = URL.createObjectURL(blob);

            content.empty();
            const img = content.createEl('img');
            img.src = objectUrl;
            img.alt = item.name;

            if (loaded.usedDownloadFallback) {
                const note = content.createDiv('yd-preview-note');
                note.textContent = this.t('preview.originalFallback');
                note.style.cssText = 'margin-top: 10px; color: var(--text-muted); font-size: 12px; text-align: center;';
            }

            const actions = content.createDiv();
            actions.style.cssText = 'margin-top: 16px; text-align: center;';
            if (this.plugin.settings.enableDownloads) {
                const dlBtn = actions.createEl('button');
                dlBtn.textContent = this.t('preview.downloadVault');
                dlBtn.addEventListener('click', () => {
                    void this.downloadFile(item);
                    modal.close();
                });
            }

            const copyBtn = actions.createEl('button');
            copyBtn.textContent = this.t('preview.copyUrl');
            copyBtn.style.marginLeft = '8px';
            copyBtn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(loaded.sourceUrl);
                new Notice(this.t('preview.urlCopied'));
            });
        } catch (error) {
            content.empty();
            const errorEl = content.createDiv('yd-empty-state');
            errorEl.textContent = this.t('preview.error', { error: error.message });

            if (this.plugin.settings.enableDownloads) {
                const dlBtn = content.createEl('button');
                dlBtn.textContent = this.t('preview.downloadInstead');
                dlBtn.style.marginTop = '16px';
                dlBtn.addEventListener('click', () => {
                    void this.downloadFile(item);
                    modal.close();
                });
            }
        }
    }

    showContextMenu(item, x, y) {
        document.querySelectorAll('.yd-context-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'yd-context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        const addItem = (icon, text, action) => {
            const div = menu.createDiv('yd-context-menu-item');
            div.innerHTML = icon + ' ' + text;
            div.addEventListener('click', () => { action(); menu.remove(); });
        };

        if (item.type === 'file') {
            addItem('⬇️', this.t('action.downloadVault'), () => this.downloadFile(item));
            addItem('🔗', this.t('action.copyPublicLink'), () => {
                if (item.public_url) {
                    navigator.clipboard.writeText(item.public_url);
                    new Notice(this.t('notice.linkCopied'));
                } else {
                    this.plugin.publishResource(item.path).then(() => {
                        new Notice(this.t('notice.resourcePublished'));
                        this.loadDirectory(this.currentPath);
                    });
                }
            });
            if (item.media_type === 'image' && (item.preview || item.file)) {
                addItem('👁️', this.t('action.previewPlugin'), () => void this.showPreview(item));
            }
            if (!this.plugin.isManualProxyEnabled() && item.file) {
                addItem('🌐', this.t('action.openBrowser'), () => window.open(item.file, '_blank'));
            }
            menu.createDiv('yd-context-menu-sep');
        }

        addItem('✂️', this.t('action.move'), () => this.showMoveDialog(item));
        addItem('📋', this.t('action.copy'), () => this.showCopyDialog(item));
        addItem('🗑️', this.t('action.delete'), () => this.deleteItem(item));
        if (item.type === 'dir') {
            menu.createDiv('yd-context-menu-sep');
            addItem('📂', this.t('action.open'), () => this.navigateTo(item.path));
        }

        document.body.appendChild(menu);
        setTimeout(() => {
            document.addEventListener('click', function close(e) {
                if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); }
            });
        }, 10);
    }

    async createNewFolder() {
        const name = await this.prompt(this.t('dialog.newFolder'), this.t('dialog.folderName'));
        if (!name) return;
        const path = (this.currentPath + '/' + name).replace(/\/+/g, '/');
        try {
            await this.plugin.createFolder(path);
            this.plugin.clearCache();
            new Notice(this.t('notice.folderCreated'));
            await this.loadDirectory(this.currentPath);
        } catch (error) {
            new Notice(this.t('error.folderCreate', { error: error.message || error }));
        }
    }

    async deleteItem(item) {
        const confirmed = await this.confirm(this.t('dialog.deleteQuestion', { name: item.name }));
        if (!confirmed) return;
        try {
            this.setItemOperation(item.path, this.t('common.delete'), 'busy');
            await this.plugin.deleteResource(item.path);

            // Mutating operations must invalidate the directory cache before reloading.
            // Otherwise getResources() can immediately return the pre-delete listing,
            // leaving a ghost row that produces HTTP 404 on a second delete attempt.
            this.plugin.clearCache();

            const row = this.itemRows.get(item.path);
            if (row && row.el) row.el.remove();
            this.itemRows.delete(item.path);
            this.items = this.items.filter((entry) => entry.path !== item.path);
            this.total = Math.max(0, this.total - 1);
            this.updatePagination();

            new Notice(this.t('notice.deleted'));
            await this.loadDirectory(this.currentPath);
        } catch (error) {
            this.clearItemOperation(item.path);
            new Notice(this.t('error.delete', { error: error.message || error }));
        }
    }

    async showMoveDialog(item) {
        const dest = await this.prompt(this.t('dialog.move'), this.t('dialog.destinationPath'), item.path);
        if (!dest || dest === item.path) return;
        try {
            await this.plugin.moveResource(item.path, dest);
            this.plugin.clearCache();
            new Notice(this.t('notice.moved'));
            await this.loadDirectory(this.currentPath);
        } catch (error) {
            new Notice(this.t('error.move', { error: error.message || error }));
        }
    }

    async showCopyDialog(item) {
        const dest = await this.prompt(this.t('dialog.copy'), this.t('dialog.destinationPath'), item.path + '_copy');
        if (!dest || dest === item.path) return;
        try {
            await this.plugin.copyResource(item.path, dest);
            this.plugin.clearCache();
            new Notice(this.t('notice.copied'));
            await this.loadDirectory(this.currentPath);
        } catch (error) {
            new Notice(this.t('error.copy', { error: error.message || error }));
        }
    }

    async showUploadDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files.length) return;
            for (const file of files) await this.uploadFile(file);
            this.loadDirectory(this.currentPath);
        });
        input.click();
    }

    async uploadFile(file) {
        try {
            this.showProgress(10);
            const remotePath = (this.currentPath + '/' + file.name).replace(/\/+/g, '/');
            const uploadUrl = await this.plugin.getUploadUrl(remotePath, true);
            this.showProgress(50);
            const arrayBuffer = await file.arrayBuffer();
            await this.plugin.uploadWithProxy(uploadUrl, arrayBuffer, file.type || 'application/octet-stream');
            this.showProgress(100);
            new Notice(this.t('notice.uploaded', { name: file.name }));
            setTimeout(() => this.hideProgress(), 1000);
        } catch (error) {
            new Notice(this.t('error.upload', { error: error.message }));
            this.hideProgress();
        }
    }

    setupDropZone() {
        if (!this.dropZoneEl) return;
        this.dropZoneEl.addEventListener('dragover', (e) => { e.preventDefault(); this.dropZoneEl.classList.add('drag-over'); });
        this.dropZoneEl.addEventListener('dragleave', () => { this.dropZoneEl.classList.remove('drag-over'); });
        this.dropZoneEl.addEventListener('drop', async (e) => {
            e.preventDefault();
            this.dropZoneEl.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            for (const file of files) await this.uploadFile(file);
            this.loadDirectory(this.currentPath);
        });
    }

    beginOperation(text, options = {}) {
        const id = ++this.operationSequence;
        this.currentOperationId = id;
        if (this.operationHideTimer) {
            window.clearTimeout(this.operationHideTimer);
            this.operationHideTimer = null;
        }
        this.operationEl.className = 'yd-operation-status visible';
        this.operationSpinnerEl.textContent = '';
        this.operationTextEl.textContent = text || this.t('operation.running');
        this.operationDetailEl.textContent = options.detail || '';
        this.operationPercentEl.textContent = '';
        this.setProgressVisual(options.percent, options.indeterminate !== false);
        return id;
    }

    updateOperation(id, options = {}) {
        if (id !== this.currentOperationId || !this.operationEl) return;
        if (options.text !== undefined) this.operationTextEl.textContent = options.text;
        if (options.detail !== undefined) this.operationDetailEl.textContent = options.detail;
        if (options.percent !== undefined) {
            this.operationPercentEl.textContent = Number.isFinite(options.percent)
                ? `${Math.max(0, Math.min(100, Math.round(options.percent)))}%`
                : '';
        }
        this.setProgressVisual(options.percent, Boolean(options.indeterminate));
    }

    completeOperation(id, text, detail = '') {
        if (id !== this.currentOperationId) return;
        if (this.operationHideTimer) {
            window.clearTimeout(this.operationHideTimer);
            this.operationHideTimer = null;
        }
        this.operationEl.className = 'yd-operation-status visible complete';
        this.operationSpinnerEl.textContent = '✅';
        this.operationTextEl.textContent = text;
        this.operationDetailEl.textContent = detail;
        this.operationPercentEl.textContent = '100%';
        this.setProgressVisual(100, false);
        this.operationHideTimer = window.setTimeout(() => {
            if (id === this.currentOperationId) this.hideProgress();
        }, 3000);
    }

    failOperation(id, text, detail = '') {
        if (id !== this.currentOperationId) return;
        if (this.operationHideTimer) {
            window.clearTimeout(this.operationHideTimer);
            this.operationHideTimer = null;
        }
        this.operationEl.className = 'yd-operation-status visible error';
        this.operationSpinnerEl.textContent = '❌';
        this.operationTextEl.textContent = text;
        this.operationDetailEl.textContent = detail;
        this.operationPercentEl.textContent = '';
        this.progressEl.classList.remove('indeterminate');
        this.progressFillEl.style.width = '0%';
        this.operationHideTimer = window.setTimeout(() => {
            if (id === this.currentOperationId) this.hideProgress();
        }, 12000);
    }

    setProgressVisual(percent, indeterminate) {
        if (!this.progressEl || !this.progressFillEl) return;
        if (indeterminate || !Number.isFinite(percent)) {
            this.progressEl.classList.add('indeterminate');
            this.progressFillEl.style.width = '38%';
        } else {
            this.progressEl.classList.remove('indeterminate');
            this.progressFillEl.style.width = `${Math.max(0, Math.min(100, percent))}%`;
        }
    }

    setItemOperation(path, text, state = 'busy') {
        const row = this.itemRows.get(path);
        if (!row) return;
        row.el.classList.toggle('is-busy', state === 'busy');
        row.operationEl.className = `yd-item-operation visible ${state === 'success' ? 'success' : (state === 'error' ? 'error' : '')}`;
        row.operationEl.textContent = text;
    }

    clearItemOperation(path) {
        const row = this.itemRows.get(path);
        if (!row) return;
        row.el.classList.remove('is-busy');
        row.operationEl.className = 'yd-item-operation';
        row.operationEl.textContent = '';
    }

    showProgress(percent) {
        if (!this.currentOperationId || !this.operationEl.classList.contains('visible')) {
            this.beginOperation(this.t('operation.running'), {
                percent: Number.isFinite(percent) ? percent : null,
                indeterminate: !Number.isFinite(percent),
            });
            return;
        }
        this.updateOperation(this.currentOperationId, {
            percent: Number.isFinite(percent) ? percent : null,
            indeterminate: !Number.isFinite(percent),
        });
    }

    hideProgress() {
        if (!this.operationEl) return;
        if (this.operationHideTimer) {
            window.clearTimeout(this.operationHideTimer);
            this.operationHideTimer = null;
        }
        this.operationEl.className = 'yd-operation-status';
        this.operationSpinnerEl.textContent = '';
        this.operationTextEl.textContent = '';
        this.operationDetailEl.textContent = '';
        this.operationPercentEl.textContent = '';
        this.progressEl.classList.remove('indeterminate');
        this.progressFillEl.style.width = '0%';
        this.currentOperationId = 0;
    }

    showSetupMessage() {
        this.fileListEl.empty();
        this.fileListEl.createDiv('yd-empty-state', (el) => {
            el.innerHTML = `<div style="font-size: 48px; margin-bottom: 16px;">🔑</div><div style="font-weight: 600; margin-bottom: 8px;">${this.t('setup.title')}</div><div style="font-size: 13px; line-height: 1.6;">${this.t('setup.text')}</div>`;
        });
    }

    prompt(title, text, defaultValue) {
        return new Promise((resolve) => {
            const modal = new Modal(this.app);
            modal.titleEl.textContent = title;
            const p = modal.contentEl.createEl('p');
            p.textContent = text;
            p.style.marginBottom = '12px';
            const input = modal.contentEl.createEl('input');
            input.type = 'text';
            input.value = defaultValue || '';
            input.style.cssText = 'width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border);';
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { modal.close(); resolve(input.value); } });
            const btnContainer = modal.contentEl.createDiv();
            btnContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;';
            const cancelBtn = btnContainer.createEl('button');
            cancelBtn.textContent = this.t('common.cancel');
            cancelBtn.addEventListener('click', () => { modal.close(); resolve(null); });
            const okBtn = btnContainer.createEl('button');
            okBtn.textContent = this.t('common.ok');
            okBtn.addEventListener('click', () => { modal.close(); resolve(input.value); });
            modal.open();
            setTimeout(() => input.focus(), 50);
        });
    }

    confirm(text) {
        return new Promise((resolve) => {
            const modal = new Modal(this.app);
            modal.titleEl.textContent = this.t('common.confirm');
            const p = modal.contentEl.createEl('p');
            p.textContent = text;
            const btnContainer = modal.contentEl.createDiv();
            btnContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;';
            const noBtn = btnContainer.createEl('button');
            noBtn.textContent = this.t('common.cancel');
            noBtn.addEventListener('click', () => { modal.close(); resolve(false); });
            const yesBtn = btnContainer.createEl('button');
            yesBtn.textContent = this.t('common.delete');
            yesBtn.style.cssText = 'background: var(--text-error); color: white;';
            yesBtn.addEventListener('click', () => { modal.close(); resolve(true); });
            modal.open();
        });
    }
}


// ===== SETTINGS =====
class YandexDiskSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    t(key, vars = {}) { return this.plugin.t(key, vars); }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: this.t('settings.title') });

        new Setting(containerEl)
            .setName(this.t('settings.language'))
            .setDesc(this.t('settings.languageDesc'))
            .addDropdown((dropdown) => dropdown
                .addOption('ru', 'Русский')
                .addOption('en', 'English')
                .setValue(this.plugin.settings.language)
                .onChange(async (value) => {
                    this.plugin.settings.language = value === 'en' ? 'en' : 'ru';
                    await this.plugin.saveSettings();
                    this.display();
                    await new Promise((resolve) => setTimeout(resolve, 0));
                    await this.plugin.refreshLocalizedViews();
                    new Notice(this.t('settings.languageChanged'));
                }));

        new Setting(containerEl)
            .setName(this.t('settings.oauth'))
            .setDesc(this.t('settings.oauthDesc'))
            .addText((text) => {
                text.setPlaceholder('y0_…')
                    .setValue(this.plugin.settings.oauthToken)
                    .onChange(async (value) => {
                        this.plugin.settings.oauthToken = value.trim();
                        await this.plugin.saveSettings();
                    });
                text.inputEl.type = 'password';
                text.inputEl.autocomplete = 'off';
            });

        const oauthHelp = containerEl.createEl('details', { cls: 'yd-oauth-help' });
        const oauthHelpSummary = oauthHelp.createEl('summary');
        oauthHelpSummary.createSpan({ text: '🔐 ' });
        oauthHelpSummary.createSpan({ text: this.t('settings.oauthHelpTitle') });

        const oauthHelpSteps = oauthHelp.createEl('ol');
        const polygonStep = oauthHelpSteps.createEl('li');
        polygonStep.createSpan({ text: `${this.t('settings.oauthHelpStep1')} ` });
        const polygonLink = polygonStep.createEl('a', {
            text: this.t('settings.oauthHelpPolygon'),
            href: 'https://yandex.ru/dev/disk/poligon/',
        });
        polygonLink.setAttr('target', '_blank');
        polygonLink.setAttr('rel', 'noopener noreferrer');

        oauthHelpSteps.createEl('li', { text: this.t('settings.oauthHelpStep2') });
        oauthHelpSteps.createEl('li', { text: this.t('settings.oauthHelpStep3') });
        oauthHelpSteps.createEl('li', { text: this.t('settings.oauthHelpStep4') });
        oauthHelpSteps.createEl('li', { text: this.t('settings.oauthHelpStep5') });

        const oauthFallback = oauthHelp.createEl('p', { cls: 'yd-oauth-help-fallback' });
        oauthFallback.createSpan({ text: `${this.t('settings.oauthHelpFallback')} ` });
        const officialHelpLink = oauthFallback.createEl('a', {
            text: this.t('settings.oauthHelpOfficial'),
            href: this.plugin.getLanguage() === 'en'
                ? 'https://yandex.com/dev/id/doc/en/tokens/debug-token'
                : 'https://yandex.ru/dev/id/doc/ru/tokens/debug-token',
        });
        officialHelpLink.setAttr('target', '_blank');
        officialHelpLink.setAttr('rel', 'noopener noreferrer');
        oauthFallback.createSpan({ text: '.' });

        oauthHelp.createDiv({
            cls: 'yd-oauth-help-security',
            text: this.t('settings.oauthHelpSecurity'),
        });

        new Setting(containerEl)
            .setName(this.t('settings.rootPath'))
            .setDesc(this.t('settings.rootPathDesc'))
            .addText((text) => text
                .setPlaceholder('disk:/')
                .setValue(this.plugin.settings.rootPath)
                .onChange(async (value) => {
                    this.plugin.settings.rootPath = value.trim() || 'disk:/';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.t('settings.pageSize'))
            .setDesc(this.t('settings.pageSizeDesc'))
            .addText((text) => {
                text.setValue(String(this.plugin.settings.pageSize));
                text.inputEl.type = 'number';
                text.inputEl.min = '10';
                text.inputEl.max = '100';
                text.onChange(async (value) => {
                    this.plugin.settings.pageSize = Math.min(100, Math.max(10, Number(value) || 20));
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName(this.t('settings.enableDownloads'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.enableDownloads)
                .onChange(async (value) => {
                    this.plugin.settings.enableDownloads = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.t('settings.downloadFolder'))
            .setDesc(this.t('settings.downloadFolderDesc'))
            .addText((text) => text
                .setValue(this.plugin.settings.downloadFolder)
                .onChange(async (value) => {
                    this.plugin.settings.downloadFolder = value.trim() || 'YandexDisk/Downloads';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.t('settings.enableUploads'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.enableUploads)
                .onChange(async (value) => {
                    this.plugin.settings.enableUploads = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.t('settings.cache'))
            .setDesc(this.t('settings.cacheDesc'))
            .addText((text) => {
                text.setValue(String(Math.round(this.plugin.settings.cacheTimeout / 1000)));
                text.inputEl.type = 'number';
                text.inputEl.min = '0';
                text.onChange(async (value) => {
                    this.plugin.settings.cacheTimeout = Math.max(0, Number(value) || 0) * 1000;
                    await this.plugin.saveSettings();
                });
            });

        containerEl.createEl('h3', { text: this.t('settings.networkHeading') });

        if (this.plugin.isMobileRuntime()) {
            new Setting(containerEl)
                .setName(this.t('settings.mobileMode'))
                .setDesc(this.t('settings.mobileModeDesc'))
                .addText((text) => {
                    text.setValue(this.t('settings.mobileModeValue'));
                    text.setDisabled(true);
                });

            const mobileInfo = containerEl.createDiv('yd-settings-warning');
            mobileInfo.setText(this.plugin.isManualProxyConfigured()
                ? this.t('settings.mobileManualSaved')
                : this.t('settings.mobileProxyInfo'));
        } else {
            new Setting(containerEl)
                .setName(this.t('settings.networkMode'))
                .setDesc(this.t('settings.networkModeDesc'))
                .addDropdown((dropdown) => dropdown
                    .addOption('system', this.t('settings.systemMode'))
                    .addOption('manual', this.t('settings.manualMode'))
                    .setValue(this.plugin.settings.networkMode)
                    .onChange(async (value) => {
                        this.plugin.settings.networkMode = value;
                        await this.plugin.saveSettings();
                        this.display();
                    }));

            if (this.plugin.settings.networkMode === 'manual') {
                const warning = containerEl.createDiv('yd-settings-warning');
                warning.setText(this.t('settings.strictWarning'));

                new Setting(containerEl)
                    .setName(this.t('settings.proxyType'))
                    .addDropdown((dropdown) => dropdown
                        .addOption('http', 'HTTP CONNECT')
                        .addOption('https', 'HTTPS CONNECT')
                        .addOption('socks5', this.t('settings.socksDns'))
                        .setValue(this.plugin.settings.proxyType)
                        .onChange(async (value) => {
                            this.plugin.settings.proxyType = value;
                            if (!this.plugin.settings.proxyPort || [8080, 3128, 1080].includes(Number(this.plugin.settings.proxyPort))) {
                                this.plugin.settings.proxyPort = value === 'socks5' ? 1080 : 8080;
                            }
                            await this.plugin.saveSettings();
                            this.display();
                        }));

                new Setting(containerEl)
                    .setName(this.t('settings.proxyHost'))
                    .setDesc(this.t('settings.proxyHostDesc'))
                    .addText((text) => text
                        .setPlaceholder(this.t('settings.proxyHostPlaceholder'))
                        .setValue(this.plugin.settings.proxyHost)
                        .onChange(async (value) => {
                            this.plugin.settings.proxyHost = value.trim();
                            await this.plugin.saveSettings();
                        }));

                new Setting(containerEl)
                    .setName(this.t('settings.proxyPort'))
                    .addText((text) => {
                        text.setValue(String(this.plugin.settings.proxyPort));
                        text.inputEl.type = 'number';
                        text.inputEl.min = '1';
                        text.inputEl.max = '65535';
                        text.onChange(async (value) => {
                            this.plugin.settings.proxyPort = Number(value) || 0;
                            await this.plugin.saveSettings();
                        });
                    });

                new Setting(containerEl)
                    .setName(this.t('settings.proxyAuth'))
                    .addToggle((toggle) => toggle
                        .setValue(this.plugin.settings.proxyAuth)
                        .onChange(async (value) => {
                            this.plugin.settings.proxyAuth = value;
                            await this.plugin.saveSettings();
                            this.display();
                        }));

                if (this.plugin.settings.proxyAuth) {
                    new Setting(containerEl)
                        .setName(this.t('settings.proxyUsername'))
                        .addText((text) => text
                            .setValue(this.plugin.settings.proxyUsername)
                            .onChange(async (value) => {
                                this.plugin.settings.proxyUsername = value;
                                await this.plugin.saveSettings();
                            }));

                    new Setting(containerEl)
                        .setName(this.t('settings.proxyPassword'))
                        .setDesc(this.t('settings.proxyPasswordDesc'))
                        .addText((text) => {
                            text.setValue(this.plugin.settings.proxyPassword)
                                .onChange(async (value) => {
                                    this.plugin.settings.proxyPassword = value;
                                    await this.plugin.saveSettings();
                                });
                            text.inputEl.type = 'password';
                            text.inputEl.autocomplete = 'new-password';
                        });
                }

                new Setting(containerEl)
                    .setName(this.t('settings.timeout'))
                    .setDesc(this.t('settings.timeoutDesc'))
                    .addText((text) => {
                        text.setValue(String(Math.round(this.plugin.settings.requestTimeout / 1000)));
                        text.inputEl.type = 'number';
                        text.inputEl.min = '5';
                        text.inputEl.max = '300';
                        text.onChange(async (value) => {
                            const seconds = Math.min(300, Math.max(5, Number(value) || 30));
                            this.plugin.settings.requestTimeout = seconds * 1000;
                            await this.plugin.saveSettings();
                        });
                    });
            }
        }

        new Setting(containerEl)
            .setName(this.t('settings.connectionTest'))
            .setDesc(this.plugin.isMobileRuntime()
                ? this.t('settings.testMobileDesc')
                : (this.plugin.isManualProxyEnabled()
                    ? this.t('settings.testManualDesc', { proxy: this.plugin.getProxyLabel() })
                    : this.t('settings.testSystemDesc')))
            .addButton((button) => button
                .setButtonText(this.t('settings.check'))
                .onClick(async () => {
                    button.setDisabled(true);
                    button.setButtonText(this.t('settings.checking'));
                    try {
                        const info = await this.plugin.getDiskInfo();
                        const free = Number(info.total_space || 0) - Number(info.used_space || 0);
                        const freeText = Number.isFinite(free) && free > 0
                            ? this.t('settings.free', { size: this.formatBytes(free) })
                            : '';
                        new Notice(this.t('settings.success', { free: freeText }));
                    } catch (error) {
                        if (error.status === 401) {
                            new Notice(this.t('settings.oauthRejected'));
                        } else {
                            new Notice(this.t('settings.connectionError', { error: error.message }), 10000);
                        }
                    } finally {
                        button.setDisabled(false);
                        button.setButtonText(this.t('settings.check'));
                    }
                }));
    }

    formatBytes(bytes) {
        const russian = this.plugin.getLanguage() === 'ru';
        if (!bytes) return russian ? '0 Б' : '0 B';
        const units = russian ? ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'] : ['B', 'KB', 'MB', 'GB', 'TB'];
        const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
        return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
    }
}

module.exports = YandexDiskExplorerPlugin;
