import z from 'zod';
export declare const providerSchemaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    label: z.ZodString;
}, z.core.$strip>>;
export declare const providersFindSchema: z.ZodObject<{
    method: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    active: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=provider.d.ts.map