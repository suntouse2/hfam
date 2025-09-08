import z from "zod";
import { domain } from "../helpers/domain.js";
export const payCreateSchema = z.object({
    domain: domain,
    orderId: z.string().nonempty(),
    amount: z.coerce.number().positive(),
    description: z.string().trim().min(2),
    projectId: z.coerce.number().nonnegative(),
    connectorId: z.coerce.number().nonnegative().optional(),
    byProvider: z.string().trim().nullable().optional(),
    method: z.string().trim().nullable().optional(),
    // prettier-ignore
    payload: z.record(z.string().max(64).regex(/^[a-z0-9_]+$/), z.string()).optional()
});
