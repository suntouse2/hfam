import z from 'zod';
export const payCreateSchema = z.object({
    orderId: z.string().nonempty(),
    amount: z.coerce.number().positive(),
    description: z.string().trim().min(2),
    projectId: z.coerce.number().nonnegative(),
    connectorId: z.coerce.number().nonnegative().optional(),
    byProvider: z.string().trim().nonempty().optional(),
    method: z.string().trim().optional(),
    payload: z
        .record(z
        .string()
        .max(64)
        .regex(/^[a-z0-9_]+$/), z.string())
        .optional(),
});
