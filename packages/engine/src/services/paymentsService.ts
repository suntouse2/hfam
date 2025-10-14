import type { PaymentDTO } from "@hfam/shared/dto/index";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import type {
	paymentCreateSchema,
	paymentFindSchema,
	paymentUpdateSchema,
} from "@hfam/shared/validation/payments";
import type z from "zod";
import prisma from "@/prisma";

type PaymentCreatePayload = z.infer<typeof paymentCreateSchema>;
type PaymentUpdatePayload = z.infer<typeof paymentUpdateSchema>;
type PaymentFindPayload = z.infer<typeof paymentFindSchema>;

export const paymentsService = {
	async createPayment(payload: PaymentCreatePayload): Promise<PaymentDTO> {
		const payment = await prisma.payment.create({ data: payload });
		return payment as PaymentDTO;
	},
	async getPaymentsByPaymentId(
		paymentId: PaymentDTO["paymentId"],
	): Promise<PaymentDTO> {
		if (!paymentId) throw ErrorAPI.badRequest("paymentId is required");
		const payment = await prisma.payment.findUnique({ where: { paymentId } });
		return payment as PaymentDTO;
	},
	async updatePayment(
		id: PaymentDTO["id"],
		payload: PaymentUpdatePayload,
	): Promise<PaymentDTO> {
		const payment = await prisma.payment.update({
			where: { id },
			data: payload,
		});
		return payment as PaymentDTO;
	},
	async getPayment(id: PaymentDTO["id"]): Promise<PaymentDTO> {
		const payment = await prisma.payment.findUnique({ where: { id } });
		return payment as PaymentDTO;
	},
	async getPayments(
		filters?: PaymentFindPayload,
		page: number = 1,
		limit: number = 20,
	): Promise<{
		data: PaymentDTO[];
		count: number;
		page: number;
		limit: number;
	}> {
		const { query, createdFrom, createdTo, ...rest } = filters || {};
		// biome-ignore lint/suspicious/noExplicitAny: fuck biome
		const where: any = {
			...rest,
			...(query
				? {
						OR: [
							{ paymentId: { contains: query, mode: "insensitive" } },
							{ orderId: { contains: query, mode: "insensitive" } },
							{ id: { contains: query, mode: "insensitive" } },
						],
					}
				: {}),
		};

		if (createdFrom || createdTo) {
			where.createdAt = {};
			if (createdFrom) where.createdAt.gte = new Date(createdFrom);
			if (createdTo) {
				const end = new Date(createdTo);
				end.setUTCHours(23, 59, 59, 999);
				where.createdAt.lte = end;
			}
		}

		const [count, payments] = await Promise.all([
			prisma.payment.count({ where }),
			prisma.payment.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
		]);

		return {
			data: payments as PaymentDTO[],
			count,
			page,
			limit,
		};
	},
};
