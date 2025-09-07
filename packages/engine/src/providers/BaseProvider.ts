import type { ConnectorDTO } from '@hfam/shared/dto/index'
import type { PaymentStatus } from '@prisma/client'
export type { Request } from 'express'
export interface ProviderRequest {
	connector: ConnectorDTO
	amount: number
	method?: string
	payload?: Record<string, string>
}
export interface ProviderCallback {
	connector: ConnectorDTO
	request: Request
}

export interface ProviderResponse {
	method?: string
	paymentUrl?: string
	paymentQr?: string
	paymentId?: string
	status?: PaymentStatus
}

export interface BaseProvider {
	create(payload: ProviderRequest): Promise<ProviderResponse>
	callback(payload: ProviderCallback): Promise<ProviderResponse>
}
