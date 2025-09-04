import { providersService } from '@/services/providersService'
import { providersFindSchema } from '@hfam/shared/validation/provider'
import { Router } from 'express'

export const providers = Router()

providers.get('/', async (req, res) => {
	const filters = providersFindSchema.parse(req.query)
	const providers = await providersService.getProviders(filters)
	res.json(providers)
})
