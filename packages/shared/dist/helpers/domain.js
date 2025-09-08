import { z } from "zod";
import { parse } from "tldts";
export const domain = z.string().trim().transform((val, ctx)=>{
    const { domain } = parse(val.startsWith('http') ? val : `https://${val}`);
    if (!domain) return ctx.addIssue({
        code: 'custom',
        message: 'Invalid domain'
    });
    return domain;
});
