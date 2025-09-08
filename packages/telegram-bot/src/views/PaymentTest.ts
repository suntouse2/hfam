import type { ConnectorDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

type ConnectorStatus = {
	connector: ConnectorDTO
	status: string
	paymentUuid: string | null
}

export default function viewPaymentTest(connectorStatuses: ConnectorStatus[]) {
	const lines = ['🔌 Тестирование платежей:\n\n']

	connectorStatuses.forEach(c => {
		lines.push(
			`• ${c.connector.name} — ${c.status}\n${c.paymentUuid ? `🔑 ${c.paymentUuid}` : ''}`
		)
	})

	const kb = new InlineKeyboard().text('⬅️ Назад', 'connectors')

	return { message: lines.join('\n'), kb }
}
