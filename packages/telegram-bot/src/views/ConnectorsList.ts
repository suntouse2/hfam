import { InlineKeyboard } from 'grammy'
import type { Project } from '@prisma/client'
import { projectsService } from '@/services/projectsService'
import { connectorService } from '@/services/connectorsService'

export async function renderConnectorsList(projectId: Project['id']) {
	const project = await projectsService.getProject(projectId)
	if (!project) return { message: '💀 Такого проекта нет.', kb: new InlineKeyboard() }

	const connectors = await connectorService.findConnectors({ projectId: project.id })

	const lines = [
		`📁 <b>${project.name}</b> (ID: ${project.id})`,
		``,
		`🌐 Подключенные провайдеры для проекта:`,
	]

	const kb = new InlineKeyboard()
	connectors.forEach(c => {
		const state = c.active ? '🟢 Включен' : '⭕ Выключен'
		const label = c.credentials.some(c => !c.value)
			? `${c.name} ┃ ${c.provider.title} (ID: ${c.id}) ┃ ⚙️ Не настроен`
			: `${c.name} ┃ ${c.provider.title} (ID: ${c.id}) ┃  ${state}`

		kb.text(label, `connector_${c.id}`).row()
	})
	kb.text('➕ Подключить провайдер ', `providers_${projectId}`).row(),
		kb.text('⬅️ Назад', `projects_${projectId}`)

	return { message: lines.join('\n'), kb }
}
