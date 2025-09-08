import { viewProvidersList } from "../views/ProvidersList.js";
import { Composer, InlineKeyboard } from "grammy";
export const providers = new Composer();
providers.callbackQuery('providers', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const { message, kb } = await viewProvidersList();
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
providers.callbackQuery(/^provider:key-(.+)$/, async (ctx)=>{
    await ctx.answerCallbackQuery();
    const providerKey = ctx.match[1];
    if (!providerKey) return;
    ctx.session.providerKey = providerKey;
    const kb = new InlineKeyboard();
    kb.text('🔌 Подключить', 'connectors:create');
    kb.text('⬅️ Назад', 'providers');
    ctx.editMessageText('Провайдер', {
        reply_markup: kb
    });
});
