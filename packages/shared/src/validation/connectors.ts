import { z } from 'zod'

export const connectorsFindSchema = z.object({
	projectId: z.coerce.number().nonnegative().optional(),
	providerId: z.coerce.number().nonnegative().optional(),
	active: z.boolean().optional(),
})

export const connectorCreateSchema = z.object({
	projectId: z.coerce.number().nonnegative(),
	providerId: z.coerce.number().nonnegative(),
	name: z.string().max(64),
})

export const connectorUpdateSchema = z.object({
	name: z.string().max(64).optional(),
	active: z.boolean().optional(),
	schema: z
		.array(
			z.object({
				key: z
					.string()
					.max(64)
					.regex(/^[a-z0-9_]+$/),
				label: z.string().max(64),
				value: z.string().optional(),
			})
		)
		.optional(),
})
