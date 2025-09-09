import { methodsApi } from '@/api/methodsApi'
import type { MyConversation, MyConversationContext } from '@/bot'
import { viewMethod } from '@/views/Method'

export default async function editMethodMin(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const { methodId } = await conversation.external(ctx => ctx.session)
	if (!methodId) return

	const method = await conversation.external(() => methodsApi.getMethod(methodId))

	const sent = await ctx.reply(
		`Выберите минимальную сумму для метода <b>${method.label}</b>:
		\nВведите - если хотите сбросить`,
		{
			parse_mode: 'HTML',
		}
	)
	const response = await conversation.waitFor('message:text')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	const data = response.message.text
	await response.deleteMessage()
	if (data === '-') {
		await conversation.external(() =>
			methodsApi.updateMethod(methodId, { minAmount: null })
		)
	} else {
		await conversation.external(() =>
			methodsApi.updateMethod(methodId, { minAmount: Number(data) })
		)
	}
	const { message, kb: newKb } = await conversation.external(() => viewMethod(methodId))
	await ctx.editMessageText(message, { reply_markup: newKb, parse_mode: 'HTML' })
}
