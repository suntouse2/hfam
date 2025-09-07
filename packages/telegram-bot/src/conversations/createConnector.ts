import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { connectorsApi } from '@/api/connectorsApi'
import { viewConnectorsList } from '@/views/ConnectorsList'

export async function createConnector(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const session = await conversation.external(ctx => ctx.session)
	const { providerKey, projectId } = session
	if (!providerKey || projectId === null) return

	const sent = await ctx.reply('✏️ Введите название для провайдера:', {
		reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
	})

	const response = await conversation.waitFor([':text', 'callback_query'])

	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	if (response.has('callback_query')) await ctx.answerCallbackQuery()

	if (response.has('message:text')) {
		await response.deleteMessage()
		await conversation.external(async () => {
			await connectorsApi.createConnector({
				projectId,
				byProvider: providerKey,
				name: response.message.text,
			})
		})
		const { message, kb } = await viewConnectorsList(projectId)
		await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
	}
	return
}
