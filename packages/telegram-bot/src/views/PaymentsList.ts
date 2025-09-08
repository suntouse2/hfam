import { paymentsApi } from '@/api/paymentsApi'
import type { PaymentDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

export default async function viewPaymentsList(projectId: number, page = 1) {
	const perPage = 5

	const payments = await paymentsApi.getPayments({ projectId }, page, 10)

	const kb = new InlineKeyboard()

	for (const p of payments.data) {
		let color: string
		if (p.status === 'PAID') color = '🟢'
		else if (p.status === 'CREATED') color = '🟡'
		else color = '🔴'

		const label = `${color} ${p.id} | ${p.domain} | ${p.amount}₽`
		kb.text(label, `payment:${p.id}`).row()
	}

	// пагинация
	if (page > 1) kb.text('⬅️ Назад', `payments:${page - 1}`)
	if (payments.data.length === perPage) kb.text('Вперед ➡️', `payments:${page + 1}`)

	// поиск по айди
	kb.row().text('🔍 Поиск по ID', 'payments:search')

	const message = `<b>Платежи (стр. ${page})</b>\n\nВыбери платёж для деталей.`

	return { message, kb }
}
