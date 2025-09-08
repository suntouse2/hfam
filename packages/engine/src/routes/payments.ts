import { paymentsService } from '@/services/paymentsService'
import { projectsService } from '@/services/projectService'
import { paymentFindSchema } from '@hfam/shared/validation/payments'
import { paginationSchema } from '@hfam/shared/validation/utils'
import { Router } from 'express'

export const payments = Router()

payments.get('/', async (req, res) => {
	const filters = paymentFindSchema.parse(req.query)
	const { page, limit } = paginationSchema.parse(req.query)
	const payments = await paymentsService.getPayments(filters, page, limit)
	res.json(payments)
})
