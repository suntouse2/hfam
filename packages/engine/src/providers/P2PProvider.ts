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
export const cardSchema = z.object({
	digits: z.string(),
	end: z.string(),
	owner: z.string(),
})

export const callbackScheme = z.object({
	status: z.enum(['SUCCESS']),
	id: z.coerce.number().nonnegative(),
})

export class P2PProvider implements BaseProvider {
	async callback({ request, connector }: ProviderCallback): Promise<ProviderResponse> {
		return {}
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount } = request
		const { json_url } = connectorScheme.parse(connector.schema)

		const json = await got.get(json_url.value ?? '').json()

		console.log(json)

		// prettier-ignore
		const cards = z.array(cardSchema).parse(json)

		const card = sample(cards)
		console.log(card)

		const paymentUrl = `/gateway/p2p/?digits=${card.digits}&end=${card.end}&owner=${card.owner}&amount=${amount}`

		return { paymentUrl: paymentUrl }
	}
}
