import type { MyContext } from '@/bot'
import { createProject } from '@/conversations/createProject'
import { deleteProject } from '@/conversations/deleteProject'
import editProjectTgSupportId from '@/conversations/editProjectTgSupportId'
import { viewProject } from '@/views/Project'
import { viewProjectList } from '@/views/ProjectList'
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'

export const projects = new Composer<MyContext>()

projects.use(createConversation(createProject))
projects.use(createConversation(deleteProject))
projects.use(createConversation(editProjectTgSupportId))

projects.callbackQuery('projects', async ctx => {
	await ctx.answerCallbackQuery()
	const { message, kb } = await viewProjectList()
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})

projects.callbackQuery('projects:create', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('createProject')
})

projects.callbackQuery('project:delete', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('deleteProject')
})

projects.callbackQuery(/^project:id-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	const projectId = Number(ctx.match![1])
	ctx.session.projectId = projectId
	const { message, kb } = await viewProject(ctx.session.projectId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})

projects.callbackQuery('project:configure:tgSupportId', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('editProjectTgSupportId')
})
