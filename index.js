const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');
const key = require('./service_account.json');

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
            .readFileSync('urls.txt', 'utf8')
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
            // Задержка 2 секунды между запросами
            await delay(1000);
        }

        console.log('✨ Обработка завершена');
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
        process.exit(1);
    }
}

main();
