import type {
	Connector,
	ConnectorCredentials,
	Payment,
	Project,
	Provider,
} from '@prisma/client'
import { wataProvider } from './wataProvider'
import type { Request } from 'express'

export interface ProviderPayload {
	amount: number
	connector: Connector & {
		credentials: ConnectorCredentials[]
		project: Project
		provider: Provider
	}
	method: string
}

export interface ProviderInstance {
	callback(req: Request): Promise<any>
	payment(payload: ProviderPayload): Promise<Payment>
}

export const providers: Record<string, ProviderInstance> = {
	wata: wataProvider,
}

export function useProvider(key: string): ProviderInstance {
	const provider = providers[key]
	if (!provider) {
		throw new Error(`Провайдер ${key} на найден`)
	}
	return provider
}
