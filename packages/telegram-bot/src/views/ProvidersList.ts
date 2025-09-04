import { InlineKeyboard } from 'grammy'
import type { Project } from '@prisma/client'
import { projectsService } from '@/services/projectsService'
import { providersService } from '@/services/providersService'

export async function renderConnectProviders(projectId: Project['id']) {
	const project = await projectsService.getProject(projectId)
	if (!project) return { message: '💀 Такого проекта нет.', kb: new InlineKeyboard() }

	const lines = [
		`📁 <b>${project.name}</b> (ID: ${project.id})`,
		``,
		`🌐 Доступные для подключения провайдеры:`,
	]

	const providers = await providersService.getProviders()

	const kb = new InlineKeyboard()
	providers.forEach(p => {
		let label: string
		label = `${p.title} ┃ 🔌 Подключить`
		kb.text(label, `connectorsAdd_${projectId}_${p.id}`).row()
	})
	kb.text('⬅️ Назад', `connectors_${projectId}`)

	return { message: lines.join('\n'), kb }
}
