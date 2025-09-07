import { methodsApi } from '@/api/methodsApi'
import type { MethodDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

export async function viewMethod(methodId: MethodDTO['id']) {
	const method = await methodsApi.getMethod(methodId)

	const connector = method.connector
		? `${method.connector.name} (ID: ${method.connectorId})`
		: null

	const lines: string[] = []

	lines.push(`📁 <b>${method.project.name}</b> (ID: ${method.projectId})`)
	lines.push('')
	const stateText = method.active ? '🟢 Включен' : '⭕ Выключен'
	lines.push(`Состояние: <b>${stateText}</b>`)
	lines.push('')

	if (connector) {
		lines.push(`<b>🌐 Провайдер:</b> ${connector}`)
	} else {
		lines.push(
			`🤖 <b>(Провайдер не задан) SmartPay:</b>\n\n` +
				`— Фильтр по провайдерам: <b><i>${method.byProvider ?? 'не указан'}</i></b>\n` +
				`— Фильтр по методу: <b><i>${method.method ?? 'не указан'}</i></b>`
		)
	}
	lines.push('')
	const toggleText = method.active ? '⏻ Выключить' : '⏻ Включить'
	const kb = new InlineKeyboard()
	kb.text(toggleText, `method:${method.active ? 'stop' : 'active'}`)
		.row()
		.row()
		.text('📊 Лимиты', `method_limits_${method.id}`)
		.text('⚙️ Настроить', `method_smartpay_${method.id}`)
		.row()
		.text('⛔  Удалить метод', `method_delete_${method.id}`)
		.row()
		.text('⬅️ Назад', `methods`)

	return { message: lines.join('\n'), kb }
}
