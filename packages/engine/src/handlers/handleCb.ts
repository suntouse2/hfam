import type { Request } from "express";
import { providers } from "@/providers";
import { connectorService } from "@/services/connectorsService";
import { paymentsService } from "@/services/paymentsService";

export const handleCb = async (request: Request, connectorId: number) => {
	const connector = await connectorService.getConnector(connectorId);
	const pInstance = providers.useInstance(connector.byProvider);
	const { paymentId, status } = await pInstance.callback({
		request,
		connector,
	});
	if (paymentId && status === "PAID") {
		const payment = await paymentsService.getPaymentsByPaymentId(paymentId);
		await paymentsService.updatePayment(payment.id, { status: "PAID" });
		return payment;
	}
	return null;
};
