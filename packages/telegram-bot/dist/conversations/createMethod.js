import { methodsApi } from "../api/methodsApi.js";
import { viewsMethodsList } from "../views/MethodsList.js";
import { InlineKeyboard } from "grammy";
export default async function createMethod(conversation, ctx) {
    const { projectId } = await conversation.external((ctx)=>ctx.session);
    if (!projectId) return;
    const kb = new InlineKeyboard().text('✖ Отмена', 'cancel').text('⏭ Пропустить', 'skip');
    // --- Шаг 1. Название ---
    const namePrompt = await ctx.reply('📝 Укажите <b>название метода</b> (или пропустите):', {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
    const nameResp = await conversation.waitFor([
        ':text',
        'callback_query'
    ]);
    await ctx.api.deleteMessage(namePrompt.chat.id, namePrompt.message_id);
    if (nameResp.has('callback_query')) {
        const data = nameResp.callbackQuery.data;
        if (data === 'cancel') {
            await ctx.answerCallbackQuery();
            return;
        }
        if (data === 'skip') {
            await ctx.answerCallbackQuery();
        }
    }
    const label = nameResp.message?.text ?? null;
    // --- Шаг 2. Изображение ---
    const imgPrompt = await ctx.reply('🖼️ Пришлите ссылку на <b>иконку</b> (или пропустите):', {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
    const imgResp = await conversation.waitFor([
        ':text',
        'callback_query'
    ]);
    await ctx.api.deleteMessage(imgPrompt.chat.id, imgPrompt.message_id);
    if (imgResp.has('callback_query')) {
        const data = imgResp.callbackQuery.data;
        if (data === 'cancel') {
            await ctx.answerCallbackQuery();
            return;
        }
        if (data === 'skip') {
            await ctx.answerCallbackQuery();
        }
    }
    const imageSrc = imgResp.message?.text ?? null;
    // --- Создание метода ---
    await ctx.deleteMessage();
    await conversation.external(()=>methodsApi.createMethod({
            projectId,
            label: label || '',
            imageSrc: imageSrc
        }));
    // --- Обновление списка ---
    const { message, kb: listKb } = await viewsMethodsList(projectId);
    await ctx.reply(message, {
        reply_markup: listKb,
        parse_mode: 'HTML'
    });
}
