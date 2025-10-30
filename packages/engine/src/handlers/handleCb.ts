import { ErrorAPI } from "@hfam/shared/helpers/error";
import type { Request } from "express";
import got from "got";
import { providers } from "@/providers";
import { connectorService } from "@/services/connectorsService";
import { paymentsService } from "@/services/paymentsService";

export const handleCb = async (request: Request, connectorId: number) => {
	const connector = await connectorService.getConnector(connectorId);
	const pInstance = providers.useInstance(connector.byProvider);

	//biome-ignore format: no need
	const { paymentId, callback, status } = await pInstance.callback({request,connector});

	if (!paymentId)
		throw ErrorAPI.badRequest("Provider callback missing paymentId");

	const payment = await paymentsService.getPaymentsByPaymentId(paymentId);

	//biome-ignore format: no need
	if (payment.status === status) throw ErrorAPI.badRequest("Payment already same status");

	//biome-ignore format: no need
	const updated = await paymentsService.updatePayment(payment.id, {status: status});

	//biome-ignore format: no need
	if (callback && status === 'PAID') await got.post(callback, { body: JSON.stringify({ ...updated }) });
	return updated;
};
