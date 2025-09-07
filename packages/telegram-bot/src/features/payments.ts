import { connectorsApi } from '@/api/connectorsApi'
import { payApi } from '@/api/payApi'
import type { MyContext } from '@/bot'
import { HTTPError } from 'got'
import { Composer, InlineKeyboard } from 'grammy'

export const payments = new Composer<MyContext>()

payments.callbackQuery('payments:test', async ctx => {
	await ctx.answerCallbackQuery()
	const projectId = ctx.session.projectId
	if (!projectId) return

	const connectors = await connectorsApi.getConnectors({ projectId, active: true })
	if (!connectors.length) {
		return ctx.reply('😔 Нет доступных провайдеров')
	}

	let text = '🔌 Тестирование коннекторов:\n\n'
	connectors.forEach(c => {
		text += `• ${c.name} — ⏳ Ожидание\n`
	})

	const sent = await ctx.reply(text, {
		reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
	})

	for (const connector of connectors) {
		text = text.replace(
			`• ${connector.name} — ⏳ Ожидание`,
			`• ${connector.name} — 🔄 Создание платежа…`
		)
		await ctx.api.editMessageText(ctx.chat!.id, sent.message_id, text, {
			reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
			parse_mode: 'HTML',
		})

		try {
			const payment = await payApi.pay({
				amount: 100,
				description: 'Тестовый платёж',
				projectId,
				connectorId: connector.id,
			})

			text = text.replace(
				`• ${connector.name} — 🔄 Создание платежа…`,
				`• ${connector.name} — ✅ Платёж создан \n(ID: <b>${payment.id}</b>)\n`
			)
		} catch (err) {
			let error = ''

			if (err instanceof HTTPError && err.response.body?.error)
				error = err.response.body?.error

			text = text.replace(
				`• ${connector.name} — 🔄 Создание платежа…`,
				`• ${connector.name} — ❌ Ошибка\n${error}\n`
			)
		}

		await ctx.api.editMessageText(ctx.chat!.id, sent.message_id, text, {
			reply_markup: new InlineKeyboard().text('⬅️ Назад', 'noop'),
			parse_mode: 'HTML',
		})
	}
})
