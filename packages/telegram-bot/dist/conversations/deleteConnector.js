import { InlineKeyboard } from "grammy";
import { connectorsApi } from "../api/connectorsApi.js";
import { providersApi } from "../api/providersApi.js";
import { viewConnectorsList } from "../views/ConnectorsList.js";
import { viewConnector } from "../views/Connector.js";
export async function deleteConnector(conversation, ctx) {
    const session = await conversation.external((ctx)=>ctx.session);
    const { connectorId } = session;
    if (connectorId == null) return;
    const connector = await connectorsApi.getConnector(connectorId);
    const provider = await providersApi.getProvider(connector.byProvider);
    const fullName = `${connector.name} | ${provider.title} (ID: ${connector.id})`;
    const sent = await ctx.reply(`Вы уверены, что хотите удалить провайдер <b>${fullName}</b>?`, {
        reply_markup: new InlineKeyboard().text('🗑️ Удалить', `confirm`).text('⬅️ Назад', 'cancel'),
        parse_mode: 'HTML'
    });
    const response = await conversation.waitFor('callback_query');
    await ctx.api.deleteMessage(sent.chat.id, sent.message_id);
    await response.answerCallbackQuery();
    const data = response.callbackQuery?.data;
    if (data && data === 'confirm') {
        await conversation.external(async ()=>await connectorsApi.deleteConnector(connectorId));
        const { message, kb } = await conversation.external(async ()=>viewConnectorsList(connector.projectId));
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
        return;
    }
    const { message, kb } = await conversation.external(async ()=>viewConnector(connector.id));
    await ctx.reply(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
    return;
}
