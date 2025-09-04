import { z } from 'zod';
export declare const projectCreateSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const projectUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    domains: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
}, z.core.$strip>;
//# sourceMappingURL=projects.d.ts.map