import { InlineKeyboard } from "grammy";
import { projectsApi } from "../api/projectsApi.js";
import { viewProjectList } from "../views/ProjectList.js";
export async function createProject(conversation, ctx) {
    const sent = await ctx.reply('✏️ Введите название проекта:', {
        reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop')
    });
    const response = await conversation.waitFor([
        ':text',
        'callback_query'
    ]);
    await ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    if (response.has('callback_query')) await response.answerCallbackQuery();
    if (response.has('message:text')) {
        await response.deleteMessage();
        await conversation.external(async ()=>await projectsApi.createProject({
                name: response.message.text
            }));
        const { message, kb } = await conversation.external(()=>viewProjectList());
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
    }
}
