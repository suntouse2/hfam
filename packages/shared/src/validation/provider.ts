import z from 'zod'

export const providerSchemaParse = z.array(
	z.object({
		// prettier-ignore
		key: z.string().max(64).regex(/^[a-z0-9_]+$/),
		label: z.string().max(64),
	})
)

export const providersFindSchema = z.object({
	method: z.union([z.string(), z.array(z.string())]).optional(),
})
