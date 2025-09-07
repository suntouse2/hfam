import { methodsApi } from '@/api/methodsApi'
import { projectsApi } from '@/api/projectsApi'
import type { ProjectDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

export async function viewMethods(projectId: ProjectDTO['id']) {
	const project = await projectsApi.getProject(projectId)
	const { methods } = project

	const lines = [
		`📁 <b>${project.name}</b> (ID: ${project.id})`,
		'',
		`🔗 <b>💳 Методы:</b>`,
		'',
	]
	const kb = new InlineKeyboard()
	methods.forEach(m => {
		const state = m.active ? '🟢 Включен' : '⭕ Выключен'

		const label = `${m.label.length ? m.label : 'без имени'}  (ID: ${m.id}) ┃ ${state}`

		kb.text(label, `method:id-${m.id}`).row()
	})
	kb.text('⬅️ Назад', `project:id-${projectId}`)

	return { message: lines.join('\n'), kb }
}
