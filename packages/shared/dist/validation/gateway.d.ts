import z from 'zod';
export declare const gatewayGetParams: z.ZodObject<{
    amount: z.ZodCoercedNumber<unknown>;
    description: z.ZodString;
    domain: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
    orderId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=gateway.d.ts.map