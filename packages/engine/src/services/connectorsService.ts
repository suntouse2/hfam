import prisma from '@/prisma'
import { z } from 'zod'
import {
	connectorBalancerFindSchema,
	connectorCreateSchema,
	connectorsFindSchema,
	connectorUpdateSchema,
} from '@hfam/shared/validation/connectors'

import type { ConnectorDTO } from '@hfam/shared/dto/index'
import { providers } from '@/providers'
import { ErrorAPI } from '@hfam/shared/helpers/error'

type ConnectorCreatePayload = z.infer<typeof connectorCreateSchema>
type ConnectorsFindPayload = z.infer<typeof connectorsFindSchema>
type ConnectorUpdatePayload = z.infer<typeof connectorUpdateSchema>
type ConnectorBalancerFindPayload = z.infer<typeof connectorBalancerFindSchema>

export const connectorService = {
	async getConnectors(filters: ConnectorsFindPayload): Promise<ConnectorDTO[]> {
		const connectors = await prisma.connector.findMany({
			where: filters,
			include: { project: true },
		})
		return connectors as ConnectorDTO[]
	},
	async getConnector(id: ConnectorDTO['id']): Promise<ConnectorDTO> {
		const connector = await prisma.connector.findUniqueOrThrow({
			where: { id },
			include: { project: true },
		})
		return connector as ConnectorDTO
	},
	async createConnector(data: ConnectorCreatePayload): Promise<ConnectorDTO> {
		const provider = providers.getProvider(data.byProvider)

		const connector = await prisma.connector.create({
			data: {
				name: data.name,
				byProvider: data.byProvider,
				projectId: data.projectId,
				schema: provider.schema,
			},
			include: { project: true },
		})
		return connector as ConnectorDTO
	},
	async updateConnector(
		id: ConnectorDTO['id'],
		data: ConnectorUpdatePayload
	): Promise<ConnectorDTO> {
		const connector = await prisma.connector.update({
			where: { id },
			data,
			include: { project: true },
		})
		return connector as ConnectorDTO
	},
	async deleteConnector(id: ConnectorDTO['id']): Promise<ConnectorDTO> {
		const connector = await prisma.connector.delete({
			where: { id },
			include: { project: true },
		})
		return connector as ConnectorDTO
	},
	async balancer(filters: ConnectorBalancerFindPayload) {
		const { method, ...rest } = filters
		const connectors = await prisma.connector.findMany({
			where: rest,
			orderBy: { bIndex: 'asc' },
			include: { project: true },
		})
		const filtered = connectors.filter(c => {
			const provider = providers.getProvider(c.byProvider)
			if (!provider.active) return false
			return method ? provider.methods.includes(method) : true
		})
		if (!filtered.length)
			throw ErrorAPI.badRequest('No available balanced connectors by this params')

		const connector = filtered[0] as ConnectorDTO

		await prisma.connector.update({
			where: { id: connector.id },
			data: { bIndex: { increment: 1 } },
		})
		return connector
	},
}
