import { z } from 'zod';
export declare const connectorsFindSchema: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    providerId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const connectorCreateSchema: z.ZodObject<{
    projectId: z.ZodCoercedNumber<unknown>;
    providerId: z.ZodCoercedNumber<unknown>;
    name: z.ZodString;
}, z.core.$strip>;
export declare const connectorUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
    schema: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=connectors.d.ts.map