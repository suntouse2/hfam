import { projectsService } from '@/services/projectsService'

import { InlineKeyboard } from 'grammy'
import type { MyConversation, MyConversationContext } from '../bot'
import { renderProjectsList } from '../views/ProjectList'

export async function deleteProject(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	if (!ctx.callbackQuery?.data) return
	const projectIdStr = ctx.callbackQuery?.data.split('_')[1]
	const projectId = Number(projectIdStr)
	if (Number.isNaN(projectId)) return

	const kb = new InlineKeyboard()
	kb.text('🗑️ Удалить', `confirm_deleteProject_${projectId}`)
	kb.text('⬅️ Назад', 'cancel_deleteProject')

	const message = `Вы уверены, что хотите удалить проект с <b>ID ${projectId}</b>?`

	const sent = await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })

	const responseCtx = await conversation.waitFor('callback_query')
	ctx.api.deleteMessage(sent.chat.id, sent.message_id)
	await responseCtx.answerCallbackQuery()

	if (responseCtx.has('callback_query')) {
		const responseData = responseCtx.callbackQuery.data

		if (responseData && responseData.startsWith('confirm_deleteProject_')) {
			try {
				await projectsService.deleteProject(projectId)
			} catch (error: any) {
				const message =
					error?.message || '💀 Не получилось удалить проект. Свяжитесь с мурадиком'
				await ctx.reply(message)
				console.error(error)
			} finally {
				const { message, kb } = await renderProjectsList()
				ctx.deleteMessage()
				await ctx.reply(message, { reply_markup: kb, parse_mode: 'HTML' })
			}
		}
	}
	return
}
