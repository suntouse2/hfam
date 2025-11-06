import type { PaginationDTO, PaymentDTO } from "@hfam/shared/dto/index";
import type { paymentFindSchema } from "@hfam/shared/validation/payments";
import type z from "zod";
import { api } from "./api";

type PaymentFindPayload = z.infer<typeof paymentFindSchema>;

export const paymentsApi = {
	async getPayments(
		filters: PaymentFindPayload,
		page?: number,
		limit?: number,
	) {
		const searchParams = { ...filters, page, limit };
		return api
			.get("payments", { searchParams })
			.json<PaginationDTO<PaymentDTO>>();
	},

	async getPayment(id: PaymentDTO["id"]) {
		return api.get(`payments/${id}`).json<PaymentDTO>();
	},

	async getStats() {
		return api.get("payments/stats/week").json<{
			count: number;
			totalAmount: number;
			data: PaymentDTO[];
		}>();
	},
};
