import { projectsApi } from '@/api/projectsApi'
import type { MyContext, MyConversationContext } from '@/bot'
import type { ProjectDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

export async function viewProjectDomains(projectId: ProjectDTO['id']) {
	const project = await projectsApi.getProject(projectId)

	const kb = new InlineKeyboard()

	project.domains.forEach((domain, idx) => {
		kb.text(`❌ ${domain}`, `project:domains:delete:i-${idx}`).row()
	})
	kb.text('➕ Добавить домен', `project:domains:add`).row()
	kb.text('⬅️ Назад', `project:id-${project.id}`)

	const lines = [
		`📁 <b>${project.name}</b> #${project.id}`,
		``,
		`🔗 Список активных доменов:`,
		`${project.domains.map(d => `▫️ ${d}`).join('\n')}`,
	]

	return { message: lines.join('\n'), kb }
}
