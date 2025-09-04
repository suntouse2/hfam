import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { connectorService } from '@/services/connectorsService'
import { renderConnectorsList } from '../views/ConnectorsList'

export async function addConnector(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const [, p, pr] = ctx.callbackQuery?.data?.split('_') ?? []
	const projectId = Number(p),
		providerId = Number(pr)
	if (!p || !pr || Number.isNaN(projectId) || Number.isNaN(providerId)) return

	const sent = await ctx.reply('✏️ Введите название для провайдера:', {
		reply_markup: new InlineKeyboard().text('⬅️ Назад', 'cancel_addProjectConnector'),
	})

	const responseCtx = await conversation.waitFor([':text', 'callback_query'])
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	if (responseCtx.has('callback_query')) await ctx.answerCallbackQuery()

	if (responseCtx.has('message:text')) {
		await responseCtx.deleteMessage()
		try {
			const name = responseCtx.message.text
			await connectorService.createConnector({ projectId, providerId, name })
		} catch (error: any) {
			const message =
				error?.message || '💀 Не получилось добавить провайдер. Свяжитесь с мурадиком'
			await ctx.reply(message)
			console.error(error)
		} finally {
			const { message, kb } = await renderConnectorsList(projectId)
			await ctx.deleteMessage()
			await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })
		}
	}
	return
}
