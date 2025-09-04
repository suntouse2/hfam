import { projectsApi } from '@/api/projectsApi'
import type { MyContext } from '@/bot'
import { addDomain } from '@/conversations/addDomain'
import { createProject } from '@/conversations/createProject'
import { deleteDomain } from '@/conversations/deleteDomain'
import { viewProject } from '@/views/Project'
import { viewProjectDomains } from '@/views/ProjectDomains'
import { viewProjectList } from '@/views/ProjectList'
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'

export const projects = new Composer<MyContext>()

projects.use(createConversation(createProject))

projects.use(createConversation(addDomain))
projects.use(createConversation(deleteDomain))

projects.callbackQuery('projects:list', async ctx => {
	await ctx.answerCallbackQuery()
	const { message, kb } = await viewProjectList()
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})

projects.callbackQuery('projects:create', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('createProject')
})

projects.callbackQuery(/^project:id-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	const projectId = Number(ctx.match![1])
	ctx.session.projectId = projectId
	const { message, kb } = await viewProject(ctx.session.projectId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
projects.callbackQuery('project:domains', async ctx => {
	await ctx.answerCallbackQuery()
	const projectId = ctx.session.projectId
	if (!projectId) return
	const { message, kb } = await viewProjectDomains(projectId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
projects.callbackQuery('project:domains:add', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('addDomain')
})
projects.callbackQuery(/^project:domains:delete:idx-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('deleteDomain')
})
