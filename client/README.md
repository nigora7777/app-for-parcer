# PAPPER — Web-интерфейс для генерации датасетов

Веб-приложение для создания обучающих датасетов из документов с помощью LLM. Позволяет загрузить документ, настроить параметры обработки и скачать готовый JSON-датасет с парами «вопрос — ответ».

***

## Технологии

- **React.js** — основной фреймворк фронтенда
- **Axios** — HTTP-запросы к бэкенду
- **Create React App** — сборщик проекта

***

## Локальный запуск (для разработки)

### Требования

- Node.js >= 16
- npm >= 8
- Запущенный бэкенд (по умолчанию на `http://localhost:8000`)

### 1. Клонировать репозиторий

```bash
git clone https://github.com/ВАШ_USERNAME/PAPPER.git
cd PAPPER/client
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

Скопировать файл-пример и заполнить значения:

```bash
cp .env.example .env
```

Открыть `.env` и указать адрес бэкенда:

```
REACT_APP_API_URL=http://localhost:8000
```

### 4. Запустить приложение

```bash
npm start
```

Приложение откроется по адресу: [http://localhost:3000](http://localhost:3000)

***

## Запуск на сервере Linux (продакшн)

### Требования

- Node.js >= 16
- npm >= 8
- Nginx (для раздачи статических файлов)

### 1. Клонировать репозиторий на сервер

```bash
git clone https://github.com/ВАШ_USERNAME/PAPPER.git
cd PAPPER/client
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

```bash
cp .env.example .env
nano .env
```

Указать адрес бэкенда на сервере:

```
REACT_APP_API_URL=http://YOUR_SERVER_IP:8000
```

### 4. Собрать приложение для продакшна

```bash
npm run build
```

Готовые файлы появятся в папке `build/`.

### 5. Настроить Nginx

Создать конфигурацию:

```bash
sudo nano /etc/nginx/sites-available/papper
```

Вставить:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    root /path/to/PAPPER/client/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Активировать и перезапустить Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/papper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

***

## Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `REACT_APP_API_URL` | Адрес бэкенд-сервера | `http://localhost:8000` |

***

## Структура проекта

```
client/
├── public/
│   └── index.html
├── src/
│   ├── Header/
│   │   └── Header.jsx          # Шапка приложения
│   ├── Layout/
│   │   ├── CheckBox/
│   │   │   └── CheckBox.jsx    # Компонент чекбокса
│   │   ├── Hooks/
│   │   │   └── useParserSettings.js  # Хук настроек парсера
│   │   ├── ReadyTo/
│   │   │   └── ReadyToGrabFiles.jsx  # Кнопка запуска задачи
│   │   └── Uploader/
│   │       └── Uploader.jsx    # Компонент загрузки файла
│   ├── App.js
│   └── index.js
├── .env                        # Переменные окружения (не в Git)
├── .env.example                # Пример переменных окружения
└── package.json
```

***

## API

Бэкенд базовый URL: `/api/v1`

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/v1/tasks` | Создать задачу обработки документа |
| `GET` | `/api/v1/tasks/{task_id}/status` | Получить статус задачи |
| `GET` | `/api/v1/tasks/{task_id}/result` | Скачать результат (JSON) |