import z from 'zod';
export const paginationSchema = z.object({
    page: z.coerce.number().nonnegative().default(1),
    limit: z.coerce.number().nonnegative().default(20),
});
