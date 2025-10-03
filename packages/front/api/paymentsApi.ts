import type { PaginationDTO, PaymentDTO } from '@hfam/shared/dto/index'
import type { paymentFindSchema } from '@hfam/shared/validation/payments'
import { api } from './api'
import z from 'zod'

type PaymentFindPayload = z.infer<typeof paymentFindSchema>

export const paymentsApi = {
	async getPayments(filters: PaymentFindPayload, page?: number, limit?: number) {
		const searchParams = { ...filters, page, limit }
		return api.get('payments', { searchParams }).json<PaginationDTO<PaymentDTO>>()
	},
}
