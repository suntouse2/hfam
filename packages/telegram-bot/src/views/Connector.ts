import { connectorsApi } from '@/api/connectorsApi'
import { projectsApi } from '@/api/projectsApi'
import { providersApi } from '@/api/providersApi'
import { connectorSchemaSchema } from '@hfam/shared/validation/connectors'
import { InlineKeyboard } from 'grammy'

export async function viewConnector(connectorId: number) {
	const connector = await connectorsApi.getConnector(connectorId)

	const { project } = connector
	const provider = await providersApi.getProvider(connector.byProvider)
	const kb = new InlineKeyboard()
	const lines: string[] = []

	lines.push(`📁 <b>${project.name}</b> (ID: ${project.id})`)
	lines.push(``)
	lines.push(`🌐 Название: <b>${connector.name}</b> (ID: ${connector.id})`)
	lines.push(`🌐 Провайдер: <b>${provider.title}</b> `)
	lines.push(``)

	const schema = connectorSchemaSchema.parse(connector.schema)

	if (Object.values(schema).some(s => !s.value)) {
		lines.push('Чтобы <b>запустить провайдер</b>, сперва настройте все ключи 🔑')
	} else {
		const stateText = connector.active ? '🟢 Включен' : '⭕ Выключен'
		lines.push(`Состояние: <b>${stateText}</b>`)
		const toggleText = connector.active ? '⏻ Выключить' : '⏻ Включить'
		kb.text(toggleText, `connector:${connector.active ? 'stop' : 'active'}`).row()
	}

	Object.entries(schema).forEach(([key, { label, value }]) => {
		kb.text(`🔑 ${label}: ${value ?? 'НЕ УКАЗАН'}`, `connector:key-${key}`).row()
	})

	kb.text('🔗 Получить коллбэк-ссылку', `connector:callback`).row(),
		kb.text('⛔ Удалить провайдер', `connector:delete`)
	kb.row().text('⬅️ Назад', `connectors`)

	return {
		message: lines.join('\n'),
		kb,
	}
}
