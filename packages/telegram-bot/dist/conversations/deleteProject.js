import { InlineKeyboard } from "grammy";
import { projectsApi } from "../api/projectsApi.js";
import { viewProjectList } from "../views/ProjectList.js";
export async function deleteProject(conversation, ctx) {
    const session = await conversation.external((ctx)=>ctx.session);
    const { projectId } = session;
    if (projectId === null) return;
    const kb = new InlineKeyboard();
    kb.text('🗑️ Удалить', `confirm`);
    kb.text('⬅️ Назад', 'cancel');
    const message = `Вы уверены, что хотите удалить проект с <b>ID ${projectId}</b>?`;
    const sent = await ctx.reply(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
    const response = await conversation.waitFor('callback_query');
    ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    await response.answerCallbackQuery();
    const data = response.callbackQuery.data;
    if (data && data === 'confirm') {
        await conversation.external(async ()=>{
            await projectsApi.deleteProject(projectId);
        });
        const { message, kb } = await conversation.external(()=>viewProjectList());
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
    }
    return;
}
