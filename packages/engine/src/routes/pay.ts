import { payCreateSchema } from "@hfam/shared/validation/pay";
import { Router } from "express";
import z from "zod";
import { handleCb } from "@/handlers/handleCb";
import { handlePay } from "@/handlers/handlePay";
import { auth } from "@/middlewares/auth";

export const pay = Router();

pay.post("/", auth, async (req, res) => {
	const payload = payCreateSchema.parse(req.body);
	const payment = await handlePay(payload);
	res.json(payment);
});

pay.post("/callback/:connectorId", async (req, res) => {
	const connectorId = z.coerce
		.number()
		.nonnegative()
		.parse(req.params.connectorId);
	await handleCb(req, connectorId);
	res.json({ success: true });
});
