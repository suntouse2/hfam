import { connectorsApi } from '@/api/connectorsApi'
import { methodsApi } from '@/api/methodsApi'
import type { MyConversation, MyConversationContext } from '@/bot'
import { viewMethod } from '@/views/Method'
import { InlineKeyboard } from 'grammy'

export default async function editMethodConnector(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const { methodId } = await conversation.external(ctx => ctx.session)
	if (!methodId) return

	const method = await conversation.external(() => methodsApi.getMethod(methodId))
	const connectors = await conversation.external(() =>
		connectorsApi.getConnectors({ projectId: method.projectId, active: true })
	)

	const kb = new InlineKeyboard()
	connectors.forEach(c => {
		const label = `${c.name} (ID: ${c.id})${c.id === method.connectorId ? ' ✅' : ''}`
		kb.text(label, `pc:${c.id}`).row()
	})
	kb.text('❌ Удалить выбор', 'pc:delete').row()

	const sent = await ctx.reply(`Выберите коннектор для метода <b>${method.label}</b>:`, {
		reply_markup: kb,
		parse_mode: 'HTML',
	})

	const { callbackQuery } = await conversation.waitFor('callback_query')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await ctx.answerCallbackQuery()
	const data = callbackQuery?.data

	if (data === 'pc:delete') {
		await conversation.external(() =>
			methodsApi.updateMethod(methodId, { connectorId: null })
		)
	} else if (data?.startsWith('pc:')) {
		await conversation.external(() =>
			methodsApi.updateMethod(methodId, { connectorId: Number(data.split(':')[1]) })
		)
	}

	const { message, kb: newKb } = await conversation.external(() => viewMethod(methodId))

	await ctx.editMessageText(message, { reply_markup: newKb, parse_mode: 'HTML' })
}
