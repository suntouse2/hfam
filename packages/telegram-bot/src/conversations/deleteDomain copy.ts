import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { projectsApi } from '@/api/projectsApi'

export async function deleteDomain(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	if (!ctx.callbackQuery) return

	const [, domainIdxStr] = ctx.callbackQuery.data?.split('_')
	const domainIdx = Number(domainIdxStr)
	const session = await conversation.external(ctx => ctx.session)
	const { projectId } = session
	if (!projectId) return
	const project = await conversation.external(() => projectsApi.getProject(projectId))
	const domain = project.domains[domainIdx]
	const sent = await ctx.reply(`Вы уверены, что хотите удалить домен <b>${domain}</b>?`, {
		reply_markup: new InlineKeyboard()
			.text('🗑️ Удалить', `confirm_deleteDomain_${projectId}_${domainIndex}`)
			.text('⬅️ Назад', 'cancel_deleteDomain'),
		parse_mode: 'HTML',
	})

	const responseCtx = await conversation.waitFor('callback_query')
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await responseCtx.answerCallbackQuery()

	if (responseCtx.has('callback_query')) {
		const responseData = responseCtx.callbackQuery.data

		if (responseData && responseData.startsWith('confirm_deleteDomain_')) {
			try {
				await projectsService.removeDomain(Number(projectId), Number(domainIndex))
			} catch (error: any) {
				const message =
					error?.message || '💀 Не получилось удалить домен. Свяжитесь с мурадиком'
				await ctx.reply(message)
				console.error(error)
			} finally {
				const { message, kb } = await renderDomainsList(Number(projectId))
				ctx.deleteMessage()
				await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })
			}
		}
	}
	return
}
