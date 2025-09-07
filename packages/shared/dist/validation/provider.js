import z from 'zod';
export const providerSchemaSchema = z.record(z
    .string()
    .max(64)
    .regex(/^[a-z0-9_]+$/), z.object({
    label: z.string().max(64),
}));
export const providersFindSchema = z.object({
    method: z.union([z.string(), z.array(z.string())]).optional(),
    active: z.coerce.boolean().optional(),
});
