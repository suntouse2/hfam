import type { z } from 'zod'

import { api } from './api'
import type { DomainDTO, ProjectDTO } from '@hfam/shared/dto/index'
import type {
	domainCreateSchema,
	domainsFindSchema,
} from '@hfam/shared/validation/domains'

type DomainsFindPayload = z.infer<typeof domainsFindSchema>
type DomainCreatePayload = z.infer<typeof domainCreateSchema>

export const domainsApi = {
	async getDomains(filters: DomainsFindPayload) {
		return api.get('domains', { searchParams: filters }).json<DomainDTO[]>()
	},
	async createDomain(data: DomainCreatePayload) {
		return api.post('domains', { json: data }).json<DomainDTO>()
	},
	async deleteDomain(id: DomainDTO['id']) {
		return api.delete(`domains/${id}`).json<DomainDTO>()
	},
}
