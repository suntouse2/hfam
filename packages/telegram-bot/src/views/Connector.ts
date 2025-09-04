import { InlineKeyboard } from 'grammy'
import { projectsService } from '@/services/projectsService'
import { connectorService } from '@/services/connectorsService'

export async function renderConnector(connectorId: number) {
	const connector = await connectorService.getConnector(connectorId)

	if (!connector) return { message: '💀 Провайдер не найден.', kb: new InlineKeyboard() }

	const { project, provider } = connector
	const kb = new InlineKeyboard()
	const lines: string[] = []

	lines.push(`📁 <b>${project.name}</b> (ID: ${project.id})`)
	lines.push(`🌐 Провайдер: <b>${provider.title}</b>`)
	lines.push(``)

	if (connector.credentials.some(c => !c.value)) {
		lines.push('Чтобы <b>запустить провайдер</b>, сперва настройте все ключи 🔑')
	} else {
		const stateText = connector.active ? '🟢 Включен' : '⭕ Выключен'
		lines.push(`Состояние: <b>${stateText}</b>`)
		const toggleText = connector.active ? '⏻ Выключить' : '⏻ Включить'
		kb.text(toggleText, `connectorsSwitch_${connector.id}`).row()
	}

	connector.credentials.forEach(c => {
		kb.text(
			`🔑 ${c.label}: ${c.value ?? 'НЕ УКАЗАН'}`,
			`editConnectorCreds_${c.id}`
		).row()
	})
	kb.text('🔗 Получить коллбэк-ссылку', `connectorsGetCallback_${connector.id}`).row(),
		kb.text('⛔ Удалить провайдер', `connectorsDelete_${connector.id}`)
	kb.row().text('⬅️ Назад', `connectors_${project.id}`)

	return {
		message: lines.join('\n'),
		kb,
	}
}
