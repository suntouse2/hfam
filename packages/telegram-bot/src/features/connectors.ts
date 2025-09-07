import { connectorsApi } from '@/api/connectorsApi'
import type { MyContext } from '@/bot'
import { createConnector } from '@/conversations/createConnector'
import { editConnectorKey } from '@/conversations/editConnectorKey'
import { viewConnector } from '@/views/Connector'
import { viewConnectorsList } from '@/views/ConnectorsList'
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { DOMAIN } from '@hfam/shared'
import { deleteConnector } from '@/conversations/deleteConnector'

export const connectors = new Composer<MyContext>()

connectors.use(createConversation(createConnector))
connectors.use(createConversation(deleteConnector))
connectors.use(createConversation(editConnectorKey))

connectors.callbackQuery('connectors', async ctx => {
	const projectId = ctx.session.projectId
	await ctx.answerCallbackQuery()
	const { message, kb } = await viewConnectorsList(projectId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
connectors.callbackQuery(/^connector:id-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	const connectorId = Number(ctx.match![1])
	ctx.session.connectorId = connectorId

	const { message, kb } = await viewConnector(connectorId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
connectors.callbackQuery(/^connector:key-(.+)$/, async ctx => {
	await ctx.answerCallbackQuery()
	const connectorKey = ctx.match![1]
	if (!connectorKey) return
	ctx.session.connectorKey = connectorKey
	await ctx.conversation.enter('editConnectorKey')
})
connectors.callbackQuery('connector:callback', async ctx => {
	await ctx.answerCallbackQuery()
	const connectorId = ctx.session.connectorId
	if (!connectorId) return
	const { url } = await connectorsApi.getConnectorCallbackPath(connectorId)
	await ctx.reply(`<code>${url}</code>`, { parse_mode: 'HTML' })
})
connectors.callbackQuery('connector:delete', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('deleteConnector')
})
connectors.callbackQuery('connector:active', async ctx => {
	await ctx.answerCallbackQuery()
	const connectorId = ctx.session.connectorId
	if (!connectorId) return
	await connectorsApi.updateConnector(connectorId, { active: true })
	const { message, kb } = await viewConnector(connectorId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
connectors.callbackQuery('connector:stop', async ctx => {
	await ctx.answerCallbackQuery()
	const connectorId = ctx.session.connectorId
	if (!connectorId) return
	await connectorsApi.updateConnector(connectorId, { active: false })
	const { message, kb } = await viewConnector(connectorId)
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
})
connectors.callbackQuery('connectors:create', async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.conversation.enter('createConnector')
})
