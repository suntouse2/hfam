import { paymentFindSchema } from "@hfam/shared/validation/payments";
import { paginationSchema } from "@hfam/shared/validation/utils";
import { Router } from "express";
import z from "zod";
import { paymentsService } from "@/services/paymentsService";

export const payments = Router();

payments.get("/", async (req, res) => {
	const filters = paymentFindSchema.parse(req.query);
	const { page, limit } = paginationSchema.parse(req.query);
	const payments = await paymentsService.getPayments(filters, page, limit);
	res.json(payments);
});

payments.get("/:id", async (req, res) => {
	const id = z.string().parse(req.params.id);
	const payment = await paymentsService.getPayment(id);
	res.json(payment);
});
payments.get("/stats/week", async (req, res) => {
	const stats = await paymentsService.getStats();
	res.json(stats);
});
