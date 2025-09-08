import z from 'zod';
export declare const paymentCreateSchema: z.ZodObject<{
    orderId: z.ZodString;
    projectId: z.ZodCoercedNumber<unknown>;
    connector: z.ZodObject<{
        project: z.ZodObject<{
            name: z.ZodString;
            id: z.ZodNumber;
        }, z.core.$strip>;
        byProvider: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>;
    domain: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
    amount: z.ZodNumber;
    paymentId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    paymentQr: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const paymentUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        CREATED: "CREATED";
        PAID: "PAID";
        REFUND: "REFUND";
    }>>;
    paymentId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    paymentQr: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=payments.d.ts.map