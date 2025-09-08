import z from 'zod';
export declare const gatewayGetParams: z.ZodObject<{
    projectId: z.ZodCoercedNumber<unknown>;
    amount: z.ZodCoercedNumber<unknown>;
    description: z.ZodString;
    domain: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
    orderId: z.ZodString;
}, z.core.$strip>;
export declare const gatewayPayParams: z.ZodObject<{
    projectId: z.ZodCoercedNumber<unknown>;
    methodId: z.ZodCoercedNumber<unknown>;
    amount: z.ZodCoercedNumber<unknown>;
    description: z.ZodString;
    orderId: z.ZodString;
    domain: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
}, z.core.$strip>;
//# sourceMappingURL=gateway.d.ts.map