import { InlineKeyboard } from "grammy";
import { methodsApi } from "../api/methodsApi.js";
import { viewsMethodsList } from "../views/MethodsList.js";
export async function deleteMethod(conversation, ctx) {
    const session = await conversation.external((ctx)=>ctx.session);
    const { projectId, methodId } = session;
    if (projectId === null || methodId === null) return;
    const sent = await ctx.reply(`Вы уверены, что хотите <b>удалить метод</b>?`, {
        reply_markup: new InlineKeyboard().text('🗑️ Удалить', `confirm`).text('⬅️ Назад', 'noop'),
        parse_mode: 'HTML'
    });
    const response = await conversation.waitFor('callback_query');
    await ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    await response.answerCallbackQuery();
    const data = response.callbackQuery.data;
    if (data && data === 'confirm') {
        await conversation.external(async ()=>{
            await methodsApi.deleteMethod(methodId);
        });
        const { message, kb } = await conversation.external(()=>viewsMethodsList(projectId));
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
    }
    return;
}
