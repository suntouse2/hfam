import { InlineKeyboard } from "grammy";
import { viewDomainsList } from "../views/DomainsList.js";
import { domainsApi } from "../api/domainsApi.js";
export async function addDomain(conversation, ctx) {
    const session = await conversation.external((ctx)=>ctx.session);
    const { projectId } = session;
    if (projectId === null) return;
    const sent = await ctx.reply('✏️ Введите название домена:', {
        reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop')
    });
    const response = await conversation.waitFor([
        ':text',
        'callback_query'
    ]);
    await ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    if (response.has('callback_query')) await ctx.answerCallbackQuery();
    if (response.has('message:text')) {
        await response.deleteMessage();
        await conversation.external(async ()=>{
            await domainsApi.createDomain({
                projectId,
                value: response.message.text
            });
        });
        const { message, kb } = await conversation.external(()=>viewDomainsList(projectId));
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
    }
    return;
}
