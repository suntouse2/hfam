import { credentialize } from '@/utils/credentialize'
import type { ProviderInstance } from '.'
import z from 'zod'
import got from 'got'
import { ApiError } from '@/utils/ApiError'
import { paymentsService } from '@/services/paymentsService'
import crypto from 'crypto'
import type { PaymentStatus } from '@prisma/client'

const KeysSchema = z.object({
	token: z.string(),
})

interface WataPaymentResponse {
	id: string
	amount: number
	url: string
}

interface WataWebhookResponse {
	transactionType: string
	transactionId: string
	terminalPublicId: string
	transactionStatus: 'Paid' | 'Declined'
	errorCode: string | null
	errorDescription: string | null
	terminalName: string
	amount: number
	currency: string
	orderId: string
	orderDescription: string
	commission: number
	paymentTime: string
	email: string | null
}

let cachedPublicKey: string | null = null

async function getPublicKey(): Promise<string> {
	if (cachedPublicKey) return cachedPublicKey
	const resp = await got
		.get('https://api.wata.pro/api/h2h/public-key')
		.json<{ value: string }>()
	cachedPublicKey = resp.value
	return cachedPublicKey
}

const statusMap: Record<string, PaymentStatus> = {
	Paid: 'PAID',
	Declined: 'CANCELED',
}

async function verifySignature(rawBody: string, signature: string): Promise<boolean> {
	const publicKey = await getPublicKey()
	const verifier = crypto.createVerify('RSA-SHA512')
	verifier.update(rawBody)
	verifier.end()
	const sigBuf = Buffer.from(signature, 'base64')
	return verifier.verify(publicKey, sigBuf)
}

export const wataProvider: ProviderInstance = {
	async callback(req) {
		const signature = req.header('x-signature')
		if (!signature) throw ApiError.badRequest('Нет подписи в заголовке')

		const rawBody = (req as any).rawBody?.toString()
		if (!rawBody) throw ApiError.badRequest('Нет raw JSON тела')

		const valid = await verifySignature(rawBody, signature)
		if (!valid) throw ApiError.badRequest('Неверная подпись вебхука')

		const data = z
			.object({
				transactionId: z.string(),
				transactionStatus: z.enum(['Paid', 'Declined']),
				amount: z.number(),
				currency: z.string(),
				errorCode: z.string().nullable(),
				errorDescription: z.string().nullable(),
			})
			.parse(JSON.parse(rawBody)) as WataWebhookResponse

		const payment = await paymentsService.findPayment({
			paymentId: data.transactionId,
		})
		const status = statusMap[data.transactionStatus]
		if (!status) throw ApiError.badRequest(`Неизвестный статус ${data.transactionStatus}`)

		await paymentsService.updatePayment(payment.id, {
			status,
		})
	},

	async payment(data) {
		const { amount, connector, method } = data
		const { projectId, providerId, provider, credentials } = connector

		if (!connector.active) throw ApiError.badRequest('Провайдер выключен')
		if (!provider.methods.includes(method)) {
			throw ApiError.badRequest('Провайдер не поддерживает данный метод')
		}

		const { token } = await KeysSchema.parseAsync(credentialize(credentials))

		const resp = await got.post<WataPaymentResponse>(
			'https://api.wata.pro/api/h2h/links',
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				json: {
					type: 'OneTime',
					amount,
					currency: 'RUB',
					description: 'Оплата доната',
				},
				responseType: 'json',
			}
		)
		const { id, url } = resp.body

		const payment = await paymentsService.createPayment({
			projectId,
			providerId,
			paymentId: id,
			paymentUrl: url,
			amount,
			method,
		})

		return payment
	},
}
