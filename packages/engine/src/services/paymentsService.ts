import prisma from '@/prisma'
import type { PaymentDTO } from '@hfam/shared/dto/index'
import type {
	paymentCreateSchema,
	paymentUpdateSchema,
} from '@hfam/shared/validation/payments'
import type z from 'zod'

type PaymentCreatePayload = z.infer<typeof paymentCreateSchema>
type PaymentUpdatePayload = z.infer<typeof paymentUpdateSchema>

export const paymentsService = {
	async createPayment(payload: PaymentCreatePayload): Promise<PaymentDTO> {
		const payment = await prisma.payment.create({ data: payload })
		return payment as PaymentDTO
	},
	//prettier-ignore
	async updatePayment
	(id: PaymentDTO['id'],payload: PaymentUpdatePayload): Promise<PaymentDTO> {
		const payment = await prisma.payment.update({ where: { id }, data: payload })
		return payment as PaymentDTO
	},
}
