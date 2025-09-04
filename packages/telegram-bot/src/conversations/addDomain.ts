import { InlineKeyboard } from 'grammy'
import type { MyContext, MyConversation, MyConversationContext } from '../bot'
import { projectsApi } from '@/api/projectsApi'
import { viewProjectDomains } from '@/views/ProjectDomains'

export async function addDomain(
	conversation: MyConversation,
	ctx: MyConversationContext
) {
	const session = await conversation.external(ctx => ctx.session)
	const { projectId } = session
	if (!projectId) return
	const project = await conversation.external(() => projectsApi.getProject(projectId))

	const sent = await ctx.reply('✏️ Введите название домена:', {
		reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
	})

	const response = await conversation.waitFor([':text', 'callback_query'])
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id)

	if (response.has('callback_query')) await ctx.answerCallbackQuery()

	if (response.has('message:text')) {
		await response.deleteMessage()
		await conversation.external(() =>
			projectsApi.updateProject(projectId, {
				domains: [...project.domains, response.message.text],
			})
		)
		const { message, kb } = await conversation.external(() =>
			viewProjectDomains(projectId)
		)
		await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
	}

	return
}
