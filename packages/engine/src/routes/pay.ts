import { ErrorAPI } from "@hfam/shared/helpers/error";
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

	try {
		await fetch(
			`http://localhost:${process.env.BOT_PORT}/notify/payment/${payment.id}`,
			{
				method: "POST",
				body: JSON.stringify(payment),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			},
		);
	} catch (error) {
		console.error(error);
	}
	res.json(payment);
});

pay.post("/callback/:connectorId", async (req, res) => {
	console.log("прилетел лог коллбека");
	const { token } = req.query;

	if (token !== process.env.API_KEY) {
		console.log("no passed token in query");
		throw ErrorAPI.badRequest("No passed token in query");
	}

	const connectorId = z.coerce
		.number()
		.nonnegative()
		.parse(req.params.connectorId);
	console.log("спарсился2");
	const payment = await handleCb(req, connectorId);
	console.log("cb обработался");
	console.log("payment", payment);
	if (payment) {
		await fetch(
			`http://localhost:${process.env.BOT_PORT}/notify/payment/${payment.id}`,
			{
				method: "POST",
				body: JSON.stringify(payment),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			},
		);
	}
	if (!payment) {
		return res.json({ success: false, message: "Payment not found" });
	}
	res.json({ success: true, payment });
});
