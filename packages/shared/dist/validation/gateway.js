import z from 'zod';
import { domain } from '../helpers/domain';
export const gatewayGetParams = z.object({
    amount: z.coerce.number().nonnegative(),
    description: z.string(),
    domain: domain,
    orderId: z.string().nonempty(),
});
