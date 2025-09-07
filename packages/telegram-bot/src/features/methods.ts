import { methodsApi } from '@/api/methodsApi'
import type { MyContext } from '@/bot'
import { viewMethod } from '@/views/Method'
import { viewMethods } from '@/views/Methods'
import { Composer } from 'grammy'

export const methods = new Composer<MyContext>()

methods.callbackQuery('methods', async ctx => {
	await ctx.answerCallbackQuery()
	const projectId = ctx.session.projectId
	if (!projectId) return
	const { message, kb } = await viewMethods(projectId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
methods.callbackQuery(/^method:id-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	const methodId = Number(ctx.match![1])
	ctx.session.methodId = methodId
	const { message, kb } = await viewMethod(methodId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
methods.callbackQuery('method:active', async ctx => {
	await ctx.answerCallbackQuery()
	const methodId = ctx.session.methodId
	if (!methodId) return

	await methodsApi.updateMethod(methodId, { active: true })
	const { message, kb } = await viewMethod(methodId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
methods.callbackQuery('method:stop', async ctx => {
	await ctx.answerCallbackQuery()
	const methodId = ctx.session.methodId
	if (!methodId) return
	console.log('xuy')

	await methodsApi.updateMethod(methodId, { active: false })
	const { message, kb } = await viewMethod(methodId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
