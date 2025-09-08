import { connectorsApi } from '@/api/connectorsApi'
import { payApi } from '@/api/payApi'
import type { MyContext } from '@/bot'
import viewPaymentTest from '@/views/PaymentTest'
import type { ConnectorDTO } from '@hfam/shared/dto/index'
import { HTTPError } from 'got'
import { Composer } from 'grammy'
import { nanoid } from 'nanoid'

export const payments = new Composer<MyContext>()

payments.callbackQuery('payments:test', async ctx => {
	await ctx.answerCallbackQuery()
	const { projectId } = ctx.session
	if (!projectId) return

	const connectors = await connectorsApi.getConnectors({ projectId, active: true })
	if (!connectors.length) return ctx.reply('😔 Нет доступных провайдеров')

	const statuses = connectors.map(c => ({
		connector: c,
		status: '⏳ Ожидание платежа',
		paymentUuid: null as string | null,
	}))

	const update = async (id: ConnectorDTO['id'], status: string, uuid: string | null) => {
		const s = statuses.find(v => v.connector.id === id)
		if (!s) return
		Object.assign(s, { status, paymentUuid: uuid })
		const { message, kb } = viewPaymentTest(statuses)
		await ctx.editMessageText(message, { reply_markup: kb, parse_mode: 'HTML' })
	}

	for (const c of connectors) {
		await update(c.id, '🔄 Создание платежа', null)
		try {
			const p = await payApi.pay({
				orderId: nanoid(),
				amount: 100,
				description: 'Тестовый платёж',
				projectId,
				connectorId: c.id,
			})
			await update(c.id, '✅ Платёж создан', p.id)
		} catch (e) {
			const msg =
				e instanceof HTTPError && e.response.body?.error
					? e.response.body.error
					: 'Ошибка'
			await update(c.id, '❌ ' + msg, null)
		}
	}
})
