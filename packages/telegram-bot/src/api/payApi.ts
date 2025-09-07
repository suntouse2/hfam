import type { z } from 'zod'
import { api } from './api'
import { payCreateSchema } from '@hfam/shared/validation/pay'
import type { PaymentDTO } from '@hfam/shared/dto/index'

type PayCreateSchema = z.infer<typeof payCreateSchema>

export const payApi = {
	async pay(payload: PayCreateSchema) {
		return api.post('pay', { json: payload }).json<PaymentDTO>()
	},
}
