import { connectorService } from '@/services/connectorsService'
import {
	connectorCreateSchema,
	connectorsFindSchema,
	connectorUpdateSchema,
} from '@hfam/shared/validation/connectors'
import { Router } from 'express'
import z from 'zod'

export const connectors = Router()

connectors.get('/', async (req, res) => {
	const filters = connectorsFindSchema.parse(req.query)
	const connectors = await connectorService.getConnectors(filters)
	res.json(connectors)
})
connectors.delete('/:id', async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const connector = await connectorService.deleteConnector(id)
	res.json(connector)
})
connectors.post('/', async (req, res) => {
	const data = connectorCreateSchema.parse(req.body)
	const connector = await connectorService.createConnector(data)
	res.json(connector)
})
connectors.patch('/:id', async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const data = connectorUpdateSchema.parse(req.body)
	const connector = await connectorService.updateConnector(id, data)
	res.json(connector)
})
