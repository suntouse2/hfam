import { handlePay } from '@/handlers/handlePay'
import { payCreateSchema } from '@hfam/shared/validation/pay'
import { Router } from 'express'

export const pay = Router()

pay.post('/', async (req, res) => {
	const payload = payCreateSchema.parse(req.body)
	const payment = await handlePay(payload)
	res.json(payment)
})
