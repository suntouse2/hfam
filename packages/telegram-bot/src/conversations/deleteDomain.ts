import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { viewDomainsList } from '@/views/DomainsList'
import { domainsApi } from '@/api/domainsApi'

export async function deleteDomain(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const session = await conversation.external(ctx => ctx.session)
	const { domainId, projectId } = session
	if (domainId === null) return

	const sent = await ctx.reply(`Вы уверены, что хотите <b>удалить домен</b>?`, {
		reply_markup: new InlineKeyboard()
			.text('🗑️ Удалить', `confirm`)
			.text('⬅️ Назад', 'noop'),
		parse_mode: 'HTML',
	})

	const response = await conversation.waitFor('callback_query')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await response.answerCallbackQuery()

	const data = response.callbackQuery.data

	if (data && data === 'confirm') {
		await conversation.external(async () => {
			await domainsApi.deleteDomain(domainId)
		})
		const { message, kb } = await conversation.external(() => viewDomainsList(projectId))
		await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
	}

	return
}
