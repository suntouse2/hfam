import { Router } from 'express'
import z from 'zod'
import { handlePay, handleSmartPay, handleWebhook } from '@/handlers/paymentsHandlers'

export const payments = Router()

const PayPayload = z.object({
	projectId: z.number(),
	connectorId: z.number(),
	method: z.string(),
	amount: z.number(),
})

const SmartPayPayload = z.object({
	projectId: z.number(),
	method: z.string(),
	amount: z.number(),
})

const WebHookPayload = z.object({
	projectId: z.number(),
	connectorId: z.number(),
})

payments.post('/', async (req, res, next) => {
	try {
		const payload = await PayPayload.parseAsync(req.body)
		const payment = await handlePay(payload)
		res.json(payment)
	} catch (err) {
		next(err)
	}
})

payments.post('/smartpay', async (req, res, next) => {
	const payload = await SmartPayPayload.parseAsync(req.body)
	const payment = await handleSmartPay(payload)
	res.json(payment)
})

payments.post('/webhook/:connectorId', async (req, res) => {
	const params = req.params
	const { connectorId } = await WebHookPayload.parseAsync(params)
	await handleWebhook({ connectorId, req })
	res.sendStatus(200)
})
