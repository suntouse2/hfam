import type z from 'zod'
import type {
	methodCreateSchema,
	methodsFindSchema,
	methodUpdateSchema,
} from '@hfam/shared/validation/methods'
import type { MethodDTO } from '@hfam/shared/dto/index'
import prisma from '@/prisma'

type MethodCreatePayload = z.infer<typeof methodCreateSchema>
type MethodUpdatePayload = z.infer<typeof methodUpdateSchema>
type MethodsFindPayload = z.infer<typeof methodsFindSchema>

export const methodsService = {
	async getMethods(filters: MethodsFindPayload): Promise<MethodDTO[]> {
		const methods = await prisma.method.findMany({
			where: filters,
			include: { project: true, connector: true },
		})
		return methods as MethodDTO[]
	},
	async getMethod(id: MethodDTO['id']): Promise<MethodDTO> {
		const method = await prisma.method.findUnique({
			where: { id },
			include: { project: true, connector: true },
		})
		return method as MethodDTO
	},
	async createMethod(payload: MethodCreatePayload): Promise<MethodDTO> {
		const method = await prisma.method.create({
			data: payload,
			include: { project: true, connector: true },
		})
		return method as MethodDTO
	},
	// prettier-ignore
	async updateMethod(id: MethodDTO['id'],payload: MethodUpdatePayload): Promise<MethodDTO> {
		const method = await prisma.method.update({ where: { id },include: { project: true, connector: true }, data: payload })
		return method as MethodDTO
	},
	async deleteMethod(id: MethodDTO['id']): Promise<MethodDTO> {
		const method = await prisma.method.delete({
			where: { id },
			include: { project: true, connector: true },
		})
		return method as MethodDTO
	},
}
