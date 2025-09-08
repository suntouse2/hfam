import { z } from 'zod';
export declare const connectorCredentialSchema: z.ZodObject<{
    label: z.ZodString;
    value: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const connectorSchemaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    label: z.ZodString;
    value: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export declare const connectorsFindSchema: z.ZodObject<{
    byProvider: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export declare const connectorCreateSchema: z.ZodObject<{
    projectId: z.ZodCoercedNumber<unknown>;
    byProvider: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const connectorUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const connectorBalancerFindSchema: z.ZodObject<{
    byProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    projectId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    method: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=connectors.d.ts.map