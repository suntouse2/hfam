import { z } from 'zod'
import { domain } from '../helpers/domain'

export const projectCreateSchema = z.object({ name: z.string().max(64) })

export const projectUpdateSchema = z.object({
	name: z.string().max(64).optional(),
	domains: z.array(domain).optional(),
})
