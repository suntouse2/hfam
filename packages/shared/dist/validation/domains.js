import { z } from 'zod';
import { domain } from '../helpers/domain';
export const domainCreateSchema = z.object({
    projectId: z.coerce.number().nonnegative(),
    value: domain,
});
export const domainsFindSchema = z.object({
    projectId: z.coerce.number().nonnegative().optional(),
});
