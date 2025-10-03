import z from 'zod'

export const methodCreateSchema = z.object({
	label: z.string(),
	imageSrc: z.string().nullable().optional(),
	projectId: z.number().nonnegative(),
	byProvider: z.string().optional(),
	connectorId: z.number().optional(),
	minAmount: z.coerce.number().nullable().optional(),
	maxAmount: z.coerce.number().nullable().optional(),
	method: z.string().optional(),
	showLabel: z.coerce.boolean().optional(),
})

export const methodsFindSchema = z.object({
	projectId: z.coerce.number().nonnegative().optional(),
	byProvider: z.string().optional(),
	connectorId: z.number().optional(),
	active: z.coerce.boolean().optional(),
	method: z.string().optional(),
	minAmount: z.coerce.number().nullable().optional(),
	maxAmount: z.coerce.number().nullable().optional(),
})

export const methodUpdateSchema = z.object({
	label: z.string().optional(),
	imageSrc: z.string().nullable().optional(),
	byProvider: z.string().nullable().optional(),
	connectorId: z.number().nullable().optional(),
	active: z.coerce.boolean().optional(),
	minAmount: z.coerce.number().nullable().optional(),
	maxAmount: z.coerce.number().nullable().optional(),
	method: z.string().nullable().optional(),
	showLabel: z.coerce.boolean().optional(),
})

export const methodClientSchema = z.array(
	z.object({
		id: z.coerce.number(),
		label: z.string(),
		imageSrc: z.string().nullable(),
		showLabel: z.coerce.boolean(),
	})
)
