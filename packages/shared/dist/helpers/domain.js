import { z } from 'zod';
const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
export const domain = z
    .string()
    .trim()
    .transform(val => {
    try {
        if (/^https?:\/\//i.test(val)) {
            const url = new URL(val);
            return url.hostname.replace(/^www\./i, '');
        }
        if (/^www\./i.test(val)) {
            return val.replace(/^www\./i, '');
        }
        return val;
    }
    catch {
        return val;
    }
})
    .refine(val => domainRegex.test(val));
