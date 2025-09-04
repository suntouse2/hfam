import { useProvider } from '@/providers'
import { connectorService } from '@/services/connectorsService'
import { connectorBalancer } from '@/utils/connectorBalancer'
import { ApiError } from '@/utils/ApiError'
import type { Connector, Payment, Project } from '@prisma/client'
import type { Request } from 'express'

export async function handlePay(payload: {
	projectId: Project['id']
	connectorId: Connector['id']
	method: string
	amount: number
}): Promise<Payment> {
	const { connectorId, amount, method } = payload

	const connector = await connectorService.getConnector(connectorId)
	if (!connector) throw ApiError.badRequest(`Коннектор ${connectorId} не найден`)

	const providerInstance = useProvider(connector.provider.key)

	return providerInstance.payment({
		amount,
		method,
		connector,
	})
}

export async function handleSmartPay(payload: {
	projectId: Project['id']
	method: string
	amount: number
}): Promise<Payment> {
	const { projectId, amount, method } = payload

	const balancer = await connectorBalancer(projectId)
	const connector = balancer.next(method)

	const providerInstance = useProvider(connector.provider.key)

	return providerInstance.payment({
		amount,
		method,
		connector,
	})
}

export async function handleWebhook({
	connectorId,
	req,
}: {
	connectorId: Connector['id']
	req: Request
}) {
	const connector = await connectorService.getConnector(connectorId)
	if (!connector) throw ApiError.badRequest(`Коннектор ${connectorId} не найден`)

	const providerInstance = useProvider(connector.provider.key)
	await providerInstance.callback(req)
}
