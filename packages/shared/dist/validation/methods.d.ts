import z from 'zod';
export declare const methodCreateSchema: z.ZodObject<{
    label: z.ZodString;
    imageSrc: z.ZodString;
    projectId: z.ZodNumber;
    byProvider: z.ZodOptional<z.ZodString>;
    connectorId: z.ZodOptional<z.ZodNumber>;
    minAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const methodsFindSchema: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodNumber>;
    byProvider: z.ZodOptional<z.ZodString>;
    connectorId: z.ZodOptional<z.ZodNumber>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export declare const methodUpdateSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    imageSrc: z.ZodOptional<z.ZodString>;
    byProvider: z.ZodOptional<z.ZodString>;
    connectorId: z.ZodOptional<z.ZodNumber>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    minAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=methods.d.ts.map