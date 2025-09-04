import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { connectorService } from '@/services/connectorsService'
import { renderConnector } from '../views/Connector'

export async function editConnectorCreds(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const [, credentialId] = ctx.callbackQuery?.data?.split('_') ?? []
	if (!credentialId) return

	const credential = await connectorService.getCredential(credentialId)
	if (!credential) return

	const kb = new InlineKeyboard()
	kb.text('⬅️ Назад', 'cancel_editProviderCredential')
	const message = `✏️ Введите новое значение для <b>${credential.label}</b>:`
	const sent = await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })

	const responseCtx = await conversation.waitFor([':text', 'callback_query'])
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	if (responseCtx.has('callback_query')) await responseCtx.answerCallbackQuery()

	if (responseCtx.has('message:text')) {
		await responseCtx.deleteMessage()

		try {
			const value = responseCtx.message.text.trim()
			await connectorService.updateCredentials(credential.id, value)
		} catch (error: any) {
			const message =
				error?.message || '💀 Не получилось обновить ключи. Свяжитесь с мурадиком'
			await ctx.reply(message)
			console.error(error)
		} finally {
			const { message, kb } = await renderConnector(credential.connectorId)
			await ctx.deleteMessage()
			await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })
		}
	}
	return
}
