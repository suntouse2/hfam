import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { connectorsApi } from '@/api/connectorsApi'
import { connectorSchemaSchema } from '@hfam/shared/validation/connectors'
import { viewConnector } from '@/views/Connector'

export async function editConnectorKey(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const session = await conversation.external(ctx => ctx.session)
	const { connectorId, connectorKey } = session
	if (connectorId == null || connectorKey == null) return

	const connector = await conversation.external(async () =>
		connectorsApi.getConnector(connectorId)
	)

	const scheme = connectorSchemaSchema.parse(connector.schema)
	const key = scheme[connectorKey]
	if (!key) return

	const sent = await ctx.reply(
		`${
			key.value?.length ? `<code>${key.value}</code>\n\n` : ``
		}✏️ Введите значение для ключа <b>${key.label}</b>:`,
		{
			reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
			parse_mode: 'HTML',
		}
	)
	const response = await conversation.waitFor([':text', 'callback_query'])
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	if (response.has('callback_query')) await response.answerCallbackQuery()
	if (response.has('message:text')) {
		await response.deleteMessage()
		await conversation.external(
			async () =>
				await connectorsApi.updateConnector(connectorId, {
					schema: {
						...scheme,
						[connectorKey]: { ...key, value: response.message.text },
					},
				})
		)
	}

	const { message, kb } = await conversation.external(() => viewConnector(connectorId))
	await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })

	return
}
