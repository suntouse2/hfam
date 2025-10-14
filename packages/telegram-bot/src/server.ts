import express from "express";
import "dotenv/config";
import helmet from "helmet";
import z from "zod";
import { paymentsApi } from "./api/paymentsApi";
import { botNotify } from "./bot";
import { auth } from "./middlewares/auth";
import { error } from "./middlewares/error";

export const server = express();

server.use(helmet({ contentSecurityPolicy: false }));

server.use(express.json({ limit: "1mb" }));
server.use(express.urlencoded({ extended: true, limit: "1mb" }));

server.post("/notify/payment/:id", auth, async (req, res) => {
	const id = z.string().parse(req.params.id);
	const payment = await paymentsApi.getPayment(id);
	if (!payment) {
		return res.status(404).json({ error: "Payment not found" });
	}
	await botNotify.payment(payment);
	res.json({ success: true });
});

//prettier-ignore
server.get("/ping", (_req, res) => {
	res.send("pong");
});

server.use(error);
