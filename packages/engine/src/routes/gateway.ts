import { handlePay } from '@/handlers/handlePay'
import { domainsService } from '@/services/domainsService'
import { methodsService } from '@/services/methodsService'
import { projectsService } from '@/services/projectService'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { gatewayGetParams, gatewayPayParams } from '@hfam/shared/validation/gateway'
import { Router } from 'express'
import z from 'zod'

export const gateway = Router()

gateway.get('/:id/methods', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.query)
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const project = await projectsService.getProject(id)
	const domains = await domainsService.getDomains({ projectId: project.id })

	if (!domains.some(m => m.value == gateway.domain))
		throw ErrorAPI.badRequest('invalid domain')
})

gateway.get('/:id/pay', async (req, res) => {
	const gateway = gatewayPayParams.parse(req.query)
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const project = await projectsService.getProject(id)
	const domains = await domainsService.getDomains({ projectId: project.id })
	const method = await methodsService.getMethod(gateway.methodId)
	if (!domains.some(m => m.value == gateway.domain))
		throw ErrorAPI.badRequest('invalid domain')

	if (!method.active) {
		throw ErrorAPI.badRequest('method is not active')
	}

	const pay = await handlePay({
		byProvider: method.byProvider === null ? undefined : method.byProvider,
		orderId: gateway.orderId,
		amount: gateway.amount,
		description: gateway.description,
		projectId: project.id,
		payload: {},
	})
	res.json({
		paymentUrl: pay.paymentUrl,
		paymentId: pay.paymentId,
		paymentQr: pay.paymentQr,
		paymentStatus: pay.status,
	})
})
