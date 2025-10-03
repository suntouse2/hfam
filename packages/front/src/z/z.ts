import z from "zod";
import { domain } from "../../../shared/src/helpers/domain";

export const paramsSchema = z.object({
	projectId: z.coerce.number().nonnegative(),
	amount: z.coerce.number().nonnegative(),
	description: z.string(),
	domain: domain,
	orderId: z.string().nonempty(),
});
