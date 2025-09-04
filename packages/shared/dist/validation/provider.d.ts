import z from 'zod';
export declare const providerSchemaParse: z.ZodArray<z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
}, z.core.$strip>>;
export declare const providersFindSchema: z.ZodObject<{
    method: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
}, z.core.$strip>;
//# sourceMappingURL=provider.d.ts.map