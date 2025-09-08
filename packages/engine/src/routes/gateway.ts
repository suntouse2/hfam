import { handlePay } from '@/handlers/handlePay'
import { domainsService } from '@/services/domainsService'
import { methodsService } from '@/services/methodsService'
import { projectsService } from '@/services/projectService'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { gatewayGetParams, gatewayPayParams } from '@hfam/shared/validation/gateway'
import { Router } from 'express'
import z from 'zod'

export const gateway = Router()

gateway.post('/', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.body)
	const methods = await methodsService
		.getMethods({ projectId: gateway.projectId, active: true })
		.then(m =>
			m.map(m => ({
				id: m.id,
				label: m.label,
				imageSrc: m.imageSrc,
				minAmount: m.minAmount,
				maxAmount: m.maxAmount,
			}))
		)

	const filteredMethods = methods.filter(m => {
		if (m.minAmount) if (m.minAmount > gateway.amount) return false
		if (m.maxAmount) if (m.maxAmount < gateway.amount) return false
		return true
	})

	res.render('pay', { gateway, filteredMethods })
})
gateway.get('/', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.query)
	const methods = await methodsService
		.getMethods({ projectId: gateway.projectId, active: true })
		.then(m => m.map(m => ({ id: m.id, label: m.label, imageSrc: m.imageSrc })))

	res.render('pay', { gateway, methods })
})

gateway.get('/:id/methods', async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const methods = await methodsService
		.getMethods({ projectId: id, active: true })
		.then(m => m.map(m => ({ id: m.id, label: m.label, imageSrc: m.imageSrc })))

	res.json(methods)
})

gateway.post('/pay', async (req, res) => {
	console.log(req.body)

	const gateway = gatewayPayParams.parse(req.body)
	const project = await projectsService.getProject(gateway.projectId)
	const method = await methodsService.getMethod(gateway.methodId)

	if (!method.active) throw ErrorAPI.badRequest('method is not active')

	const pay = await handlePay({
		projectId: project.id,
		orderId: gateway.orderId,
		amount: gateway.amount,
		description: gateway.description,
		domain: gateway.domain,
		byProvider: method.byProvider,
		payload: {},
	})

	res.json(pay)
})
