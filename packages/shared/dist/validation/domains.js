import { z } from "zod";
import { domain } from "../helpers/domain.js";
export const domainCreateSchema = z.object({
    projectId: z.coerce.number().nonnegative(),
    value: domain
});
export const domainsFindSchema = z.object({
    projectId: z.coerce.number().nonnegative().optional()
});
