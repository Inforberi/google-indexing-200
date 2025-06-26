const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');
const path = require('path');

const args = process.argv.slice(2); // Получаем аргументы
const target = args[0] || 'studia'; // По-умолчанию studia

const serviceAccountPath = path.resolve(
    __dirname,
    `service_accounts/service_account_${target}.json`
);
const urlsPath = path.resolve(__dirname, `urls/urls_${target}.txt`);

if (!fs.existsSync(serviceAccountPath)) {
    console.error(`❌ Нет файла сервисного аккаунта: ${serviceAccountPath}`);
    process.exit(1);
}
if (!fs.existsSync(urlsPath)) {
    console.error(`❌ Нет файла с url: ${urlsPath}`);
    process.exit(1);
}

const key = require(serviceAccountPath);

// Функция для валидации URL
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Функция для задержки
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Функция для обработки одного URL
async function processUrl(url, jwtClient) {
    try {
        const tokens = await jwtClient.authorize();

        const response = await axios.post(
            'https://indexing.googleapis.com/v3/urlNotifications:publish',
            {
                url: url,
                type: 'URL_UPDATED',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        console.log(`✅ [OK] ${url}\n`);

        console.log(`✅ Успешно обработан URL: ${url}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Ошибка при обработке URL ${url}:`, error.message);
        return null;
    }
}

async function main() {
    try {
        // Чтение и валидация файла
        const urls = fs
            .readFileSync(urlsPath, 'utf8') // ← исправлено тут!
            .split('\n')
            .map((url) => url.trim())
            .filter((url) => url && isValidUrl(url));

        if (urls.length === 0) {
            throw new Error('Нет валидных URL в файле');
        }

        console.log(`📝 Найдено ${urls.length} URL для обработки`);

        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/indexing'],
            null
        );

        // Обработка URL с задержкой
        for (const url of urls) {
            await processUrl(url, jwtClient);
            // Задержка 1 секунда между запросами
            await delay(1000);
        }

        console.log('✨ Обработка завершена');
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
        process.exit(1);
    }
}

main();
