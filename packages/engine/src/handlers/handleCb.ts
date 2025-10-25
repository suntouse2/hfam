import type { Request } from "express";
import got from "got";
import { providers } from "@/providers";
import { connectorService } from "@/services/connectorsService";
import { paymentsService } from "@/services/paymentsService";

export const handleCb = async (request: Request, connectorId: number) => {
	const connector = await connectorService.getConnector(connectorId);
	const pInstance = providers.useInstance(connector.byProvider);

	const { paymentId, callback, status } = await pInstance.callback({
		request,
		connector,
	});

	if (paymentId && status === "PAID") {
		const payment = await paymentsService.getPaymentsByPaymentId(paymentId);
		const updated = await paymentsService.updatePayment(payment.id, {
			status: "PAID",
		});

		if (callback) {
			await got.post(callback, { body: JSON.stringify({ ...updated }) });
		}

		return payment;
	}
	return null;
};
