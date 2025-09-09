import { z } from 'zod'

export const projectCreateSchema = z.object({
	name: z.string().max(64),
	tgSupportId: z.string().max(64).optional(),
})

export const projectUpdateSchema = z.object({
	name: z.string().trim().max(64).optional(),
	tgSupportId: z.string().max(64).optional(),
})
