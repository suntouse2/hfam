import { providers } from "../providers/index.js";
import { connectorService } from "../services/connectorsService.js";
import { domainsService } from "../services/domainsService.js";
import { paymentsService } from "../services/paymentsService.js";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import { paymentCreateSchema } from "@hfam/shared/validation/payments";
export const handlePay = async (payPayload)=>{
    const { amount, projectId, payload, byProvider, method, connectorId, domain } = payPayload;
    let connector;
    if (connectorId) connector = await connectorService.getConnector(connectorId);
    else connector = await connectorService.balancer({
        projectId,
        byProvider,
        method
    });
    const domains = await domainsService.getDomains({
        projectId
    });
    if (!domains.some((m)=>m.value == domain)) throw ErrorAPI.badRequest('invalid domain');
    const pInstance = providers.useInstance(connector.byProvider);
    const payment = await paymentsService.createPayment(paymentCreateSchema.parse({
        ...payPayload,
        connector
    }));
    const updates = await pInstance.create({
        connector,
        amount,
        payload
    });
    const updated = paymentsService.updatePayment(payment.id, updates);
    return updated;
};
