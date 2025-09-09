import z from 'zod'
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from './BaseProvider'
import { connectorCredentialSchema } from '@hfam/shared/validation/connectors'
import { sample } from '@hfam/shared/helpers/sample'
import got from 'got'
import { DOMAIN } from '@hfam/shared'

const ConnectorKeys = z.enum(['json_url'])

export const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema)
export const numberSchema = z.object({
	number: z.string(),
	bank: z.string(),
	owner: z.string(),
})

export const callbackScheme = z.object({
	status: z.enum(['SUCCESS']),
	id: z.coerce.number().nonnegative(),
})

export class SBPNumberProvider implements BaseProvider {
	async callback({ request, connector }: ProviderCallback): Promise<ProviderResponse> {
		return {}
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount } = request
		const { json_url } = connectorScheme.parse(connector.schema)

		const json = await got.get(json_url.value ?? '').json()

		console.log(json)

		// prettier-ignore
		const numbers = z.array(numberSchema).parse(json)

		const { number, owner, bank } = sample(numbers)

		const params = new URLSearchParams({
			number,
			amount: String(amount),
			owner,
			bank,
		})

		const paymentUrl = `/gateway/sbpnumber/?${params.toString()}`

		return { paymentUrl: paymentUrl }
	}
}
