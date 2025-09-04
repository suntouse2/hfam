import { InlineKeyboard } from 'grammy'
import { projectsApi } from '@/api/projectsApi'
import { connectorsApi } from '@/api/connectorsApi'
import type { MyContext } from '@/bot'
import type { ProjectDTO } from '@hfam/shared/dto/index'

export async function viewProject(projectId: ProjectDTO['id']) {
	const project = await projectsApi.getProject(projectId)
	const connectors = await connectorsApi.getConnectors({ projectId })
	const lines = [
		`📁 <b>${project.name}</b> (ID: ${project.id})`,
		'',
		`🔗 <b>Активных доменов:</b> ${project.domains.length}`,
		`🌐 <b>Активных провайдеров:</b> ${connectors.length}`,
		'',
	]

	const kb = new InlineKeyboard()
		.text('🔗 Мои домены', `project:domains`)
		.text('🌐 Провайдеры', `project:connectors`)
		.row()
		.text('🧾 Платежи', `project:payments`)
		.text('💳 Тест платежа', `project:payments:test`)
		.row()
		.text('⛔ Удалить проект', `project:delete`)
		.row()
		.text('⬅️ Назад', `projects:list`)

	return { message: lines.join('\n'), kb }
}
