import { z } from 'zod';
export const connectorCredentialSchema = z.object({
    label: z.string().max(64),
    value: z.string().optional(),
});
export const connectorSchemaSchema = z.record(z
    .string()
    .max(64)
    .regex(/^[a-z0-9_]+$/), connectorCredentialSchema);
export const connectorsFindSchema = z.object({
    byProvider: z.string().trim().optional(),
    projectId: z.coerce.number().nonnegative().optional(),
    active: z.coerce.boolean().optional(),
});
export const connectorCreateSchema = z.object({
    projectId: z.coerce.number().nonnegative(),
    byProvider: z.string().trim().max(64),
    name: z.string().trim().max(64),
});
export const connectorUpdateSchema = z.object({
    name: z.string().trim().max(64).optional(),
    active: z.coerce.boolean().optional(),
    schema: connectorSchemaSchema.optional(),
});
export const connectorBalancerFindSchema = z.object({
    byProvider: z.string().trim().optional(),
    projectId: z.coerce.number().nonnegative().optional(),
    active: z.coerce.boolean().optional(),
    method: z.string().trim().nonempty().optional(),
});
