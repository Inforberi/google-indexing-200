# Google Indexing API Bulk Submission

Скрипт для массовой отправки URL сайта в Google Indexing API для быстрой индексации. Поддерживает несколько сайтов и ключей сервисных аккаунтов. Удобен для SEO, разработки и тестирования.

---

## Как пользоваться

1. **Скачайте репозиторий и установите зависимости:**

    ```bash
    git clone https://github.com/Inforberi/google-indexing-200.git
    cd google-indexing-api-bulk
    npm install
    ```

2. **Получите сервисный аккаунт для каждого сайта:**

   - Откройте Google Cloud Console, настройте проект и сервисный аккаунт для Indexing API ([инструкция Google](https://developers.google.com/search/apis/indexing-api/v3/prereqs)).
   - Скачайте JSON-файл с ключом сервисного аккаунта.
   - Поместите каждый ключ в папку `service_accounts/` с уникальным именем, например:
        - `service_accounts/service_account_studia.json`
        - `service_accounts/service_account_fifty.json`

3. **Добавьте email сервисного аккаунта как владельца сайта:**

   - Найдите поле `client_email` внутри вашего JSON-файла ключа, например:  
     `my-service-account@project-id.iam.gserviceaccount.com`
   - Перейдите в [Google Search Console](https://search.google.com/search-console/welcome), выберите свой сайт, откройте настройки пользователей и добавьте этот email как Owner (Владелец).

4. **Создайте файлы с URL:**

   - В папке `urls/` создайте текстовые файлы для каждого сайта:
        - `urls/urls_studia.txt`
        - `urls/urls_fifty.txt`
   - В каждом файле укажите URL по одному на строку:
        ```
        https://mysite.ru/page-1
        https://mysite.ru/page-2
        ```

5. **Убедитесь, что структура проекта такая:**

    ```
    project-root/
    ├─ index.js
    ├─ package.json
    ├─ service_accounts/
    │    ├─ service_account_studia.json
    │    └─ service_account_fifty.json
    ├─ urls/
    │    ├─ urls_studia.txt
    │    └─ urls_fifty.txt
    ```

6. **Запуск скрипта:**

    - Для сайта "studia":
      ```bash
      npm run start studia
      ```
    - Для сайта "fifty":
      ```bash
      npm run start fifty
      ```
    - Если не указать аргумент, по умолчанию будет использоваться `studia`.

7. **Пример scripts в package.json:**

    ```json
    "scripts": {
      "start": "node index.js"
    }
    ```

8. **После запуска:**

    - В консоли увидите отчёт о количестве URL и статусе отправки для каждого.
    - Если будут ошибки (например, неправильный ключ или не добавлен email в Search Console) — скрипт напишет об этом.

---

## Важно знать

- **Лимиты Google Indexing API:** максимум 200 URL в сутки для одного сайта.
- Email сервисного аккаунта **обязательно** должен быть добавлен как Owner для каждого сайта в Google Search Console.
- Для каждого нового сайта просто добавьте новый ключ и новый файл с URL.

---

**Всё готово!**  
Массовая отправка ваших страниц в Google теперь — одна команда.

---