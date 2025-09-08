import { methodsApi } from '@/api/methodsApi'
import type { ProjectDTO } from '@hfam/shared/dto/index'
import { InlineKeyboard } from 'grammy'

export async function viewsMethodsList(projectId: ProjectDTO['id']) {
	const methods = await methodsApi.getMethods({ projectId })
	const kb = new InlineKeyboard()

	methods.forEach(m => {
		const state = m.active ? '┃ 🟢' : '┃ ⭕'
		const label = `${m.label.length > 0 ? m.label : 'Без имени'} (ID: ${m.id}) ${state}`
		kb.text(label, `method:id-${m.id}`).row()
	})

	kb.text('➕ Добавить метод', 'methods:create').row()
	kb.text('⬅️ Назад', `project:id-${projectId}`)

	return { message: `➡️ Список ваших методов (${methods.length}):`, kb }
}
