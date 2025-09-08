import { methodsApi } from '@/api/methodsApi'
import { providersApi } from '@/api/providersApi'
import type { MyConversation, MyConversationContext } from '@/bot'
import { viewMethod } from '@/views/Method'
import { InlineKeyboard } from 'grammy'
export default async function editMethodMethods(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const { methodId } = await conversation.external(ctx => ctx.session)
	if (!methodId) return

	const method = await conversation.external(() => methodsApi.getMethod(methodId))

	const providersMethods = await conversation.external(() => providersApi.getProviders())

	const methods = providersMethods.flatMap(p => p.methods)

	const kb = new InlineKeyboard()
	methods.forEach(m => {
		const label = `${m} ${m === method.method ? ' ✅' : ''}`
		kb.text(label, `mm:${m}`).row()
	})
	kb.text('❌ Удалить выбор', 'mm:delete').row()

	const sent = await ctx.reply(`Выберите метод для метода <b>${method.label}</b>:`, {
		reply_markup: kb,
		parse_mode: 'HTML',
	})

	const { callbackQuery } = await conversation.waitFor('callback_query')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await ctx.answerCallbackQuery()
	const data = callbackQuery?.data

	if (data === 'mm:delete') {
		await conversation.external(() => methodsApi.updateMethod(methodId, { method: null }))
	} else if (data?.startsWith('mm:')) {
		await conversation.external(() =>
			methodsApi.updateMethod(methodId, { method: data.split(':')[1] })
		)
	}

	const { message, kb: newKb } = await conversation.external(() => viewMethod(methodId))
	await ctx.editMessageText(message, { reply_markup: newKb, parse_mode: 'HTML' })
}
