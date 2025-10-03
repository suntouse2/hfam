import { parse } from "tldts";
import { z } from "zod";

export const domain = z
	.string()
	.trim()
	.transform((val, ctx) => {
		const { domain } = parse(val.startsWith("http") ? val : `https://${val}`);
		if (!domain)
			// biome-ignore lint/suspicious/noExplicitAny: this is helper
			return ctx.addIssue({ code: "custom", message: "Invalid domain" }) as any;
		return domain;
	});
