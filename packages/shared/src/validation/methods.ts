import z from 'zod'

export const methodCreateSchema = z.object({
	label: z.string(),
	imageSrc: z.string(),
	projectId: z.number().nonnegative(),
	byProvider: z.string().optional(),
	connectorId: z.number().optional(),
	minAmount: z.coerce.number().optional(),
	maxAmount: z.coerce.number().optional(),
})

export const methodsFindSchema = z.object({
	projectId: z.number().nonnegative().optional(),
	byProvider: z.string().optional(),
	connectorId: z.number().optional(),
	active: z.coerce.boolean().optional(),
})

export const methodUpdateSchema = z.object({
	label: z.string().optional(),
	imageSrc: z.string().optional(),
	byProvider: z.string().optional(),
	connectorId: z.number().optional(),
	active: z.coerce.boolean().optional(),
	minAmount: z.coerce.number().optional(),
	maxAmount: z.coerce.number().optional(),
})
