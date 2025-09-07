import { z } from 'zod';
export declare const projectCreateSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const projectUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=projects.d.ts.map