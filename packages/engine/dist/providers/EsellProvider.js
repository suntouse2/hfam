import z from "zod";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import email from "@fakerjs/email";
import got from "got";
import { handlePayCbLink } from "../handlers/handlePayCbLink.js";
import { ErrorAPI } from "@hfam/shared/helpers/error";
const ConnectorKeys = z.enum([
    'esell_token'
]);
export const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema);
export const callbackScheme = z.object({
    status: z.enum([
        'SUCCESS'
    ]),
    id: z.coerce.number().nonnegative()
});
export class EsellProvider {
    async callback({ request, connector }) {
        const data = callbackScheme.parse(request.body);
        if (data.status !== 'SUCCESS') throw ErrorAPI.badRequest('Callback expected status=SUCCESS');
        return {
            paymentId: data.id.toString(),
            status: 'PAID'
        };
    }
    async create(request) {
        const { amount, payload, connector } = request;
        const { esell_token } = connectorScheme.parse(connector.schema);
        const body = {
            donate_url: esell_token.value,
            amount: amount,
            email: payload?.email ?? email({
                domain: 'gmail.com'
            }),
            callbackUrl: `${handlePayCbLink(connector.id)}`
        };
        const request_link = 'https://esell.su/api/generatePaymentUrl';
        const response = await got.post(request_link, {
            json: body,
            retry: {
                limit: 4
            }
        }).json();
        if (response.success === false) {
            console.log(response);
            throw ErrorAPI.badRequest('Provider success key is false');
        }
        if (!response.location) {
            console.log(response);
            throw ErrorAPI.badRequest('Provider response missing required field "location"');
        }
        return {
            paymentId: response.id.toString(),
            paymentUrl: response.location
        };
    }
}
