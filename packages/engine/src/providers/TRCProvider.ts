import z from 'zod'
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from './BaseProvider'
import { connectorCredentialSchema } from '@hfam/shared/validation/connectors'

const ConnectorKeys = z.enum(['trc_wallet'])

export const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema)

export const callbackScheme = z.object({
	status: z.enum(['SUCCESS']),
	id: z.coerce.number().nonnegative(),
})

export class TRCProvider implements BaseProvider {
	async callback({ request, connector }: ProviderCallback): Promise<ProviderResponse> {
		return {}
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount } = request
		const { trc_wallet } = connectorScheme.parse(connector.schema)

		const paymentUrl = `/gateway/trc/?wallet=${trc_wallet.value}&amount=${amount}`

		return { paymentUrl: paymentUrl }
	}
}
