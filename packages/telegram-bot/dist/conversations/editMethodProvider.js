import { methodsApi } from "../api/methodsApi.js";
import { providersApi } from "../api/providersApi.js";
import { viewMethod } from "../views/Method.js";
import { InlineKeyboard } from "grammy";
export default async function editMethodProvider(conversation, ctx) {
    const { methodId } = await conversation.external((ctx)=>ctx.session);
    if (!methodId) return;
    const method = await conversation.external(()=>methodsApi.getMethod(methodId));
    const providers = await providersApi.getProviders({
        active: true
    });
    const kb = new InlineKeyboard();
    providers.forEach((p)=>{
        const label = `${p.title} ${p.key === method.byProvider ? ' ✅' : ''}`;
        kb.text(label, `pm:${p.key}`).row();
    });
    kb.text('❌ Удалить выбор', 'pm:delete').row();
    const sent = await ctx.reply(`Выберите шлюз для метода <b>${method.label}</b>:`, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
    const { callbackQuery } = await conversation.waitFor('callback_query');
    await ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    await ctx.answerCallbackQuery();
    const data = callbackQuery?.data;
    if (data === 'pm:delete') {
        await conversation.external(()=>methodsApi.updateMethod(methodId, {
                byProvider: null
            }));
    } else if (data?.startsWith('pm:')) {
        await conversation.external(()=>methodsApi.updateMethod(methodId, {
                byProvider: data.split(':')[1]
            }));
    }
    const { message, kb: newKb } = await conversation.external(()=>viewMethod(methodId));
    await ctx.editMessageText(message, {
        reply_markup: newKb,
        parse_mode: 'HTML'
    });
}
