import { methodsApi } from '@/api/methodsApi'
import { providersApi } from '@/api/providersApi'
import { InlineKeyboard } from 'grammy'
import z from 'zod'

export async function viewMethod(connectorId: number) {
	const method = await methodsApi.getMethod(connectorId)

	const kb = new InlineKeyboard()
	const lines: string[] = []

	const provider = method.byProvider
		? await providersApi.getProvider(method.byProvider)
		: null

	lines.push(`🌐 Название: <b>${method.label || 'Без имени'}</b> (ID: ${method.id})`)
	lines.push(' ')

	const stateText = method.active ? '🟢 Включен' : '⭕ Выключен'
	lines.push(`Состояние: <b>${stateText}</b>`)

	const toggleText = method.active ? '⏻ Выключить' : '⏻ Включить'
	kb.text(toggleText, `method:${method.active ? 'stop' : 'active'}`).row()

	kb.text(
		`${method.showLabel ? '✅ Имя отображается' : '❌ Имя не отображается'}`,
		`method:configure:showLabel:${method.showLabel ? 'false' : 'true'}`
	)

	kb.row()

	if (method.imageSrc && z.string().url().safeParse(method.imageSrc).success) {
		kb.url('🏞️ Иконка', method.imageSrc).row()
	}

	kb.text(
		`🌐 Провайдер: ${method?.connector?.name || 'Не выбран'}`,
		`method:configure:connector`
	)
	kb.row()

	if (!method.connector) {
		kb.text(`🔗 Шлюз: ${provider?.title || 'Не выбран'}`, `method:configure:provider`)
		kb.row()
		kb.text(`🧩 Метод: ${method.method || 'Не выбран'}`, `method:configure:methods`)
		kb.row()
	}

	kb.text(`➖ От ${method.minAmount || ' - '}₽`, `method:configure:minAmount`)
	kb.text(`➕ До ${method.maxAmount || ' - '}₽`, `method:configure:maxAmount`)
	kb.row()
	kb.text('⛔ Удалить метод', `method:delete`)
	kb.row().text('⬅️ Назад', `methods`)

	return {
		message: lines.join('\n'),
		kb,
	}
}
