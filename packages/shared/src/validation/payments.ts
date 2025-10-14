import z from "zod";
import type { PaymentDTO } from "../dto";
import { domain } from "../helpers/domain";

export const paymentCreateSchema = z.object({
	orderId: z.string().nonempty(),
	projectId: z.coerce.number().nonnegative(),
	connector: z
		.object({
			project: z.object({
				name: z.string().trim(),
				id: z.number().nonnegative(),
			}),
			byProvider: z.string().trim().max(64),
			name: z.string().trim().max(64),
		})
		.strip(),
	domain: domain,
	amount: z.number().positive(),
	paymentId: z.string().optional(),
	paymentUrl: z.string().optional(),
	paymentQr: z.string().optional(),
	method: z.string().optional(),
	description: z.string().nonempty().optional(),
	// prettier-ignore
	payload: z
		.record(
			z
				.string()
				.max(64)
				.regex(/^[a-z0-9_]+$/),
			z.string(),
		)
		.optional(),
});

export const paymentUpdateSchema = z.object({
	status: z
		.enum(["CREATED", "PAID", "REFUND"] as PaymentDTO["status"][])
		.optional(),
	paymentId: z.string().optional(),
	paymentUrl: z.string().optional(),
	paymentQr: z.string().optional(),
	method: z.string().optional(),
});

export const paymentFindSchema = z.object({
	projectId: z.coerce.number().nonnegative().optional(),
	status: z
		.enum(["CREATED", "PAID", "REFUND"] as PaymentDTO["status"][])
		.optional(),
	createdAt: z.string().date().optional(),
	updatedAt: z.string().date().optional(),
	domain: domain.optional(),
	query: z.string().optional(),
});
