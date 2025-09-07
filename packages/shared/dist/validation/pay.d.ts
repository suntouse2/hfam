import z from 'zod';
export declare const payCreateSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodCoercedNumber<unknown>;
    description: z.ZodString;
    projectId: z.ZodCoercedNumber<unknown>;
    connectorId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    byProvider: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodString>;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=pay.d.ts.map