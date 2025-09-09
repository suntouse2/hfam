import { handlePay } from '@/handlers/handlePay'
import { cardSchema } from '@/providers/P2PProvider'
import { numberSchema } from '@/providers/SBPNumberProvider'
import { methodsService } from '@/services/methodsService'
import { projectsService } from '@/services/projectService'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { gatewayGetParams, gatewayPayParams } from '@hfam/shared/validation/gateway'
import { methodClientSchema } from '@hfam/shared/validation/methods'
import { Router } from 'express'
import z from 'zod'

export const gateway = Router()

gateway.post('/', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.body)
	const methods = await methodsService.getMethods({
		projectId: gateway.projectId,
		active: true,
		minAmount: gateway.amount,
		maxAmount: gateway.amount,
	})
	const project = await projectsService.getProject(gateway.projectId)
	const supportId = project.tgSupportId

	const parsed = methodClientSchema.parse(methods)

	res.render('pay', { gateway, methods: parsed, supportId })
})
gateway.get('/', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.query)
	const methods = await methodsService.getMethods({
		projectId: gateway.projectId,
		active: true,
		minAmount: gateway.amount,
		maxAmount: gateway.amount,
	})
	const project = await projectsService.getProject(gateway.projectId)
	const supportId = project.tgSupportId
	const parsed = methodClientSchema.parse(methods)

	res.render('pay', { gateway, methods: parsed, supportId })
})

gateway.get('/:id/methods', async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const methods = await methodsService.getMethods({ projectId: id, active: true })
	const parsed = methodClientSchema.parse(methods)

	res.json(parsed)
})

gateway.get('/p2p', async (req, res) => {
	const card = cardSchema.parse(req.query)
	const amount = z.coerce.number().nonnegative().parse(req.query.amount)
	const projectId = z.coerce.number().nonnegative().parse(req.query.projectId)
	const project = await projectsService.getProject(projectId)
	const supportId = project.tgSupportId
	res.render('p2p', { card, amount, supportId })
})
gateway.get('/sbpnumber', async (req, res) => {
	const { number, owner, bank } = numberSchema.parse(req.query)
	const amount = z.coerce.number().nonnegative().parse(req.query.amount)
	const projectId = z.coerce.number().nonnegative().parse(req.query.projectId)
	const project = await projectsService.getProject(projectId)
	const supportId = project.tgSupportId
	res.render('sbpnumber', { number, amount, owner, bank, supportId })
})
gateway.get('/trc', async (req, res) => {
	const wallet = z.string().parse(req.query.wallet)
	const amount = z.coerce.number().nonnegative().parse(req.query.amount)
	const projectId = z.coerce.number().nonnegative().parse(req.query.projectId)
	const project = await projectsService.getProject(projectId)
	const supportId = project.tgSupportId
	res.render('trc', { wallet, amount, supportId })
})
gateway.post('/pay', async (req, res) => {
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
		connectorId: method.connectorId,
		byProvider: method.byProvider,
		payload: gateway.payload,
	})

	res.json(pay)
})
