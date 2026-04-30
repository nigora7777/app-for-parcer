#  Парсер документов

Веб-приложение для загрузки документов и их парсинга с помощью LLM.  
Пользователь загружает файлы, настраивает параметры обработки и скачивает результат в формате JSON.

***

##  Технологии

- [React.js](https://reactjs.org/) — UI-фреймворк
- [Bootstrap 5](https://getbootstrap.com/) — стилизация компонентов
- [Axios](https://axios-http.com/) — HTTP-запросы к API
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — сохранение настроек и последней задачи

***

##  Структура проекта

```
src/
├── App.js                        # Корневой компонент
├── index.js                      # Точка входа
├── Header/
│   └── Header.js                 # Шапка приложения
└── Layout/
    ├── Uploader/
    │   └── Uploader.js           # Компонент загрузки файлов
    ├── CheckBox/
    │   └── CheckBox.js           # Форма настроек парсера
    ├── ReadyTo/
    │   └── ReadyToGrabFiles.js   # Отображение статуса и скачивание
    └── Hooks/
        └── useParserSettings.js  # Кастомный хук — вся бизнес-логика
```

***

##  Функциональность

-  **Загрузка файлов** — поддерживаемые форматы: `doc`, `docx`, `ppt`, `pptx`, `pdf`, `txt`, `md`
-  **Валидация** — проверка формата, размера (макс. 50MB) и повторений
-  **Настройки парсера:**
  - Выбор форматов для обработки
  - OCR (оптическое распознавание)
  - Структура заголовков
  - Количество итераций (1–5)
  - Тайм-аут запросов к LLM (30–300 сек.)
  - Повторы при ошибке (1–5)
-  **Polling статуса задачи** — автообновление каждые 3 секунды
-  **Сохранение настроек** в `localStorage`
-  **Скачивание результата** в формате `dataset_<task_id>.json`

***

##  API Endpoints

| Метод | Endpoint                    | Описание                 |
|-------|-----------------------------|--------------------------|
| POST  | `/api/v1/tasks`             | Создать задачу парсинга  |
| GET   | `/api/v1/tasks/:id/status`  | Получить статус задачи   |
| GET   | `/api/v1/tasks/:id/result`  | Скачать результат (JSON) |

***

##  Переменные окружения

Перед запуском создайте файл `.env` в корне проекта.

### Для локального запуска

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Для запуска на сервере Linux

```env
REACT_APP_API_URL=http://<IP-адрес-сервера>:8000
REACT_APP_FRONTEND_URL=http://<IP-адрес-сервера>:3000
```

>  Файл `.env` содержит чувствительные данные. Не загружайте его в репозиторий — убедитесь, что `.env` есть в `.gitignore`.

***

##  Установка и запуск

###  Требования

- [Node.js](https://nodejs.org/) v18+
- npm v9+

***

###  Локальный запуск (Windows / macOS / Linux)

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/nigora7777/app-for-parcer
   cd app-for-parcer
   ```

2. Создайте файл `.env` (см. раздел выше)

3. Установите зависимости:
   ```bash
   npm install
   ```

4. Запустите в режиме разработки:
   ```bash
   npm start
   ```

5. Откройте в браузере: [http://localhost:3000](http://localhost:3000)

***

###  Запуск на сервере Linux (Ubuntu/Debian)

1. Обновите пакеты и установите Node.js:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nodejs npm
   ```

2. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/nigora7777/app-for-parcer
   cd app-for-parcer
   ```

3. Создайте файл `.env` (см. раздел выше)

4. Установите зависимости:
   ```bash
   npm install
   ```

5. Соберите production-сборку:
   ```bash
   npm run build
   ```

6. Установите и запустите веб-сервер **serve**:
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

7. Если нужно чтобы приложение работало в фоне (после закрытия терминала):
   ```bash
   nohup serve -s build -l 3000 &
   ```

8. Откройте порт в файрволе:
   ```bash
   sudo ufw allow 3000
   ```

9. Откройте в браузере: `http://<IP-адрес-сервера>:3000`

***

##  Автор

**Нигора Хамракулова**