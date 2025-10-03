import prisma from '@/prisma'
import type { PaymentDTO } from '@hfam/shared/dto/index'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import type {
	paymentCreateSchema,
	paymentFindSchema,
	paymentUpdateSchema,
} from '@hfam/shared/validation/payments'
import type z from 'zod'

type PaymentCreatePayload = z.infer<typeof paymentCreateSchema>
type PaymentUpdatePayload = z.infer<typeof paymentUpdateSchema>
type PaymentFindPayload = z.infer<typeof paymentFindSchema>

export const paymentsService = {
	async createPayment(payload: PaymentCreatePayload): Promise<PaymentDTO> {
		const payment = await prisma.payment.create({ data: payload })
		return payment as PaymentDTO
	},
	async getPaymentsByPaymentId(paymentId: PaymentDTO['paymentId']): Promise<PaymentDTO> {
		if (!paymentId) throw ErrorAPI.badRequest('paymentId is required')
		const payment = await prisma.payment.findUnique({ where: { paymentId } })
		return payment as PaymentDTO
	},
	async updatePayment(
		id: PaymentDTO['id'],
		payload: PaymentUpdatePayload
	): Promise<PaymentDTO> {
		const payment = await prisma.payment.update({ where: { id }, data: payload })
		return payment as PaymentDTO
	},
	async getPayment(id: PaymentDTO['id']): Promise<PaymentDTO> {
		const payment = await prisma.payment.findUnique({ where: { id } })
		return payment as PaymentDTO
	},
	async getPayments(
		filters?: PaymentFindPayload,
		page: number = 1,
		limit: number = 20
	): Promise<{ data: PaymentDTO[]; count: number; page: number; limit: number }> {
		const { query, ...rest } = filters || {}
		const where = {
			...rest,
			...(query ? { OR: [{ paymentId: query }, { orderId: query }, { id: query }] } : {}),
		}
		const [count, payments] = await Promise.all([
			prisma.payment.count({ where }),
			prisma.payment.findMany({ where, skip: (page - 1) * limit, take: limit }),
		])

		return {
			data: payments as PaymentDTO[],
			count,
			page,
			limit,
		}
	},
}
