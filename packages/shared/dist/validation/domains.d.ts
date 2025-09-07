import { z } from 'zod';
export declare const domainCreateSchema: z.ZodObject<{
    projectId: z.ZodCoercedNumber<unknown>;
    value: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
}, z.core.$strip>;
export declare const domainsFindSchema: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=domains.d.ts.map