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
		const { minAmount, maxAmount, ...rest } = filters

		const methods = await prisma.method.findMany({
			where: { ...rest },
			include: { project: true, connector: true },
		})

		return methods.filter(
			m =>
				(minAmount == null || m.minAmount == null || m.minAmount <= minAmount) &&
				(maxAmount == null || m.maxAmount == null || m.maxAmount >= maxAmount)
		) as MethodDTO[]
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
		const method = await prisma.method.update({ where: { id },include: { project: true, connector: true }, data: {
			label: payload.label,
			imageSrc: payload.imageSrc,
			byProvider: payload.byProvider,
			connectorId: payload.connectorId,
			active: payload.active,
			minAmount: payload.minAmount,
			maxAmount: payload.maxAmount,
			method: payload.method,
			showLabel: payload.showLabel
		} })
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
