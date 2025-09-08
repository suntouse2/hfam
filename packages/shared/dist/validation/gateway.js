import z from 'zod';
import { domain } from '../helpers/domain';
export const gatewayGetParams = z.object({
    amount: z.coerce.number().nonnegative(),
    description: z.string(),
    domain: domain,
    orderId: z.string().nonempty(),
});
export const gatewayPayParams = z.object({
    methodId: z.coerce.number().nonnegative(),
    amount: z.coerce.number().nonnegative(),
    description: z.string(),
    orderId: z.string().nonempty(),
    domain: domain,
});
