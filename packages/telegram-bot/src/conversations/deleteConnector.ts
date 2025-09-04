import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { connectorService } from '@/services/connectorsService'
import { renderConnectorsList } from '../views/ConnectorsList'

export async function deleteConnector(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const [, connectorId = NaN] = ctx.callbackQuery?.data?.split('_').map(Number) ?? []
	if (Number.isNaN(connectorId)) return

	const connector = await connectorService.getConnector(connectorId)
	if (!connector) return

	const fullName = `${connector.name} | ${connector.provider.title} (ID: ${connector.id})`

	const kb = new InlineKeyboard()
	kb.text('🗑️ Удалить', `confirm_deleteConnector_${connector.id}`)
	kb.text('⬅️ Назад', 'back')

	const message = `Вы уверены, что хотите удалить провайдер <b>${fullName}</b>?`

	const sent = await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })

	const responseCtx = await conversation.waitFor('callback_query')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await responseCtx.answerCallbackQuery()

	const responseData = responseCtx.callbackQuery?.data

	if (responseData && responseData.startsWith('confirm_deleteConnector_')) {
		try {
			await connectorService.deleteConnector(connector.id)
		} catch (error: any) {
			const message =
				error?.message || '💀 Не получилось удалить провайдер. Свяжитесь с 	мурадиком'
			await ctx.reply(message)
			console.error(error)
		} finally {
			const { message, kb } = await renderConnectorsList(connector.project.id)
			ctx.deleteMessage()
			await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })
		}
	}

	return
}
