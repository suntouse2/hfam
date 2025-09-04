import prisma from '@/prisma'
import type { ProjectDTO } from '@hfam/shared/dto/index'
import type {
	projectCreateSchema,
	projectUpdateSchema,
} from '@hfam/shared/validation/projects'
import type z from 'zod'

type ProjectCreatePayload = z.infer<typeof projectCreateSchema>
type ProjectUpdatePayload = z.infer<typeof projectUpdateSchema>

export const projectsService = {
	async getProjects(): Promise<ProjectDTO[]> {
		const projects = await prisma.project.findMany()
		return projects
	},
	async createProject({ name }: ProjectCreatePayload): Promise<ProjectDTO> {
		const project = await prisma.project.create({ data: { name } })
		return project
	},
	async deleteProject(id: ProjectDTO['id']): Promise<ProjectDTO> {
		const project = await prisma.project.delete({ where: { id } })
		return project
	},
	async getProject(id: ProjectDTO['id']): Promise<ProjectDTO> {
		const project = await prisma.project.findUniqueOrThrow({ where: { id } })
		return project
	},
	async updateProject(
		id: ProjectDTO['id'],
		payload: Partial<ProjectUpdatePayload>
	): Promise<ProjectDTO> {
		const project = await prisma.project.update({ where: { id }, data: payload })
		return project
	},
}
