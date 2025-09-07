// src/features/start.ts
import { Composer } from 'grammy'
import { InlineKeyboard } from 'grammy'

export const start = new Composer()

start.command('start', async ctx => {
	const kb = new InlineKeyboard().text('💠 Мои проекты', 'projects')
	await ctx.reply(
		'🦋 Быстрые & удобные подключение провайдеров, AI инструменты, множество провайдеров, балансеры',
		{ reply_markup: kb }
	)
})

start.callbackQuery('start', async ctx => {
	ctx.answerCallbackQuery()
	const kb = new InlineKeyboard().text('💠 Мои проекты', 'projects')
	await ctx.reply(
		'🦋 Быстрые & удобные подключение провайдеров, AI инструменты, множество провайдеров, балансеры',
		{ reply_markup: kb }
	)
})
