import type { ProviderDTO } from '@hfam/shared/dto/index'
import { providersFindSchema } from '@hfam/shared/validation/provider'

import { api } from './api'
import z from 'zod'

type ConnectorsFindPayload = z.infer<typeof providersFindSchema>

export const providersApi = {
	async getProviders(filters?: ConnectorsFindPayload) {
		const params = new URLSearchParams()
		Object.entries(filters ?? {}).forEach(([key, value]) => {
			if (value === undefined) return
			if (Array.isArray(value)) {
				value.forEach(v => params.append(key, v))
			} else {
				params.set(key, String(value))
			}
		})
		return api.get('providers', { searchParams: params }).json<ProviderDTO[]>()
	},
	async getProvider(key: ProviderDTO['key']) {
		return api.get(`providers/${key}`).json<ProviderDTO>()
	},
}
