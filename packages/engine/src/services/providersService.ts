import prisma from '@/prisma'
import type { ProviderDTO } from '@hfam/shared/dto/index'
import { prismify } from '@hfam/shared/utils/prismify'
import type { providersFindSchema } from '@hfam/shared/validation/provider'
import type { Provider } from '@prisma/client'
import type z from 'zod'

type ProvidersFindPayload = z.infer<typeof providersFindSchema>

export const providersService = {
	async getProviders(filters?: ProvidersFindPayload): Promise<ProviderDTO[]> {
		const providers = (await prisma.provider.findMany({
			where: { ...prismify.hasSome('methods', filters?.method) },
			orderBy: { id: 'asc' },
		})) as ProviderDTO[]
		return providers
	},
	async getProvider(id: Provider['id']): Promise<ProviderDTO> {
		const provider = (await prisma.provider.findUnique({ where: { id } })) as ProviderDTO
		return provider
	},
}
