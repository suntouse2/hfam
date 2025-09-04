import type { z } from 'zod'

import { api } from './api'
import type { ProjectDTO } from '@hfam/shared/dto/index'
import type {
	projectCreateSchema,
	projectUpdateSchema,
} from '@hfam/shared/validation/projects'

export const projectsApi = {
	async getProjects() {
		return api.get('projects').json<ProjectDTO[]>()
	},

	async createProject(data: z.infer<typeof projectCreateSchema>) {
		return api.post('projects', { json: data }).json<any>()
	},

	async getProject(id: ProjectDTO['id']) {
		return api.get(`projects/${id}`).json<ProjectDTO>()
	},

	async deleteProject(id: ProjectDTO['id']) {
		return api.delete(`projects/${id}`).json<ProjectDTO>()
	},

	async updateProject(id: ProjectDTO['id'], data: z.infer<typeof projectUpdateSchema>) {
		return api.patch(`projects/${id}`, { json: data }).json<any>()
	},
}
