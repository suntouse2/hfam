import { InlineKeyboard } from "grammy";
export async function renderStart(ctx) {
    const kb = new InlineKeyboard().text('💠 Мои проекты', 'projects');
    // prettier-ignore
    const message = '🦋 Удобная оплата, быстрая настройка проектов, и умные инструменты для принятия платежей.';
    await ctx.reply(message, {
        reply_markup: kb
    });
}
