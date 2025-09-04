import prisma from '@/prisma'
import { z } from 'zod'
import {
	connectorCreateSchema,
	connectorsFindSchema,
	connectorUpdateSchema,
} from '@hfam/shared/validation/connectors'
import { providerSchemaParse } from '@hfam/shared/validation/provider'
import type { Connector } from '@prisma/client'
import type { ConnectorDTO, ProviderDTO } from '@hfam/shared/dto/index'

type ConnectorCreatePayload = z.infer<typeof connectorCreateSchema>
type ConnectorsFindPayload = z.infer<typeof connectorsFindSchema>
type ConnectorUpdatePayload = z.infer<typeof connectorUpdateSchema>

export const connectorService = {
	async getConnectors(filters: ConnectorsFindPayload): Promise<ConnectorDTO[]> {
		const connectors = (await prisma.connector.findMany({
			where: filters,
		})) as ConnectorDTO[]
		return connectors
	},
	async createConnector(data: ConnectorCreatePayload): Promise<ConnectorDTO> {
		const provider = (await prisma.provider.findUniqueOrThrow({
			where: { id: data.providerId },
		})) as ProviderDTO

		const schema = providerSchemaParse.parse(provider.schema)

		const connector = (await prisma.connector.create({
			data: {
				name: data.name,
				providerId: data.providerId,
				projectId: data.projectId,
				schema: schema,
			},
		})) as ConnectorDTO
		return connector
	},
	async updateConnector(
		id: ConnectorDTO['id'],
		data: ConnectorUpdatePayload
	): Promise<ConnectorDTO> {
		const connector = (await prisma.connector.update({
			where: { id },
			data,
		})) as ConnectorDTO
		return connector
	},
	async deleteConnector(id: ConnectorDTO['id']): Promise<ConnectorDTO> {
		const connector = (await prisma.connector.delete({
			where: { id },
		})) as ConnectorDTO
		return connector
	},
}
