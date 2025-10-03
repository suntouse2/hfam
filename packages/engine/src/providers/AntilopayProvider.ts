import z from 'zod'
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from './BaseProvider'
import { connectorCredentialSchema } from '@hfam/shared/validation/connectors'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import crypto from 'crypto'
import got from 'got'
import { v4 as uuidv4 } from 'uuid'
import email from '@fakerjs/email'

const ConnectorKeys = z.enum(['project_id', 'secret_id', 'secret_key', 'callback_key'])

export const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema)

export const callbackScheme = z.object({
	status: z.enum(['SUCCESS', 'FAIL']),
	payment_id: z.string(),
})

export class AntilopayProvider implements BaseProvider {
	verifySign(signature: string, payload: string, publicKeyBase64: string): boolean {
		if (!signature) return false

		const pubKey = crypto.createPublicKey({
			key: Buffer.from(publicKeyBase64, 'base64'),
			format: 'der',
			type: 'spki',
		})

		const verifier = crypto.createVerify('RSA-SHA256')
		verifier.update(payload)
		return verifier.verify(pubKey, signature, 'base64')
	}

	private signPayload(secretKey: string, payload: string): string {
		const key = crypto.createPrivateKey({
			key: Buffer.from(secretKey, 'base64'),
			format: 'der',
			type: 'pkcs8',
		})

		return crypto.sign('RSA-SHA256', Buffer.from(payload), key).toString('base64')
	}
	async callback({ request, connector }: ProviderCallback): Promise<ProviderResponse> {
		const signature = request.header('X-Apay-Sign')
		if (!signature) throw ErrorAPI.badRequest('Invalid signature')

		const { callback_key } = connectorScheme.parse(connector.schema)
		if (!callback_key.value) throw ErrorAPI.badRequest('callback_key is required')

		if (!this.verifySign(signature, JSON.stringify(request.body), callback_key.value))
			throw ErrorAPI.badRequest('Invalid signature')

		const data = callbackScheme.parse(request.body)

		if (data.status !== 'SUCCESS') return {}

		return {
			paymentId: data.payment_id,
			status: 'PAID',
		}
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload: requestPayload, connector } = request
		const { secret_key, secret_id, project_id } = connectorScheme.parse(connector.schema)

		if (!secret_key.value || !project_id.value || !secret_id.value)
			throw ErrorAPI.badRequest('secret_key, project_id, secret_id are required')

		const uuid = uuidv4()

		const payload = JSON.stringify({
			project_identificator: project_id.value,
			amount: amount,
			order_id: uuid,
			currency: 'RUB',
			product_name: 'Покупка кейса',
			product_type: 'goods',
			description: 'Покупка кейса',
			customer: {
				email: requestPayload?.email ?? email({ domain: 'gmail.com' }),
			},
		})

		const sign = this.signPayload(secret_key.value, payload)

		const response = await got
			.post('https://lk.antilopay.com/api/v1/payment/create', {
				headers: {
					'Content-Type': 'application/json',
					'X-Apay-Secret-Id': secret_id.value,
					'X-Apay-Sign': sign,
					'X-Apay-Sign-Version': '1',
				},
				body: payload,
			})
			.json<{ payment_id: string; payment_url: string }>()

		return {
			paymentId: response.payment_id,
			paymentUrl: response.payment_url,
		}
	}
}
