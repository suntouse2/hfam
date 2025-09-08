import z from "zod";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import got from "got";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
const ConnectorKeys = z.enum([
    'shop_id',
    'secret_key',
    'api_key'
]);
export const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema);
export const callbackScheme = z.object({
    id: z.number().nonnegative(),
    amount: z.number(),
    currency: z.string(),
    uuid: z.string(),
    payment_status: z.enum([
        'success',
        'cancel'
    ])
});
export class MulenProvider {
    async callback({ request, connector }) {
        const { api_key } = connectorScheme.parse(connector.schema);
        const auth = request.headers.get('Authorization');
        if (!auth || !auth.startsWith('Bearer ')) {
            throw ErrorAPI.badRequest('Missing or invalid Authorization header');
        }
        const token = auth.replace('Bearer ', '');
        if (token !== api_key.value) {
            throw ErrorAPI.badRequest('Invalid API key');
        }
        const data = callbackScheme.parse(request.body);
        if (data.payment_status !== 'success') throw ErrorAPI.badRequest('Callback expected status=success');
        return {
            paymentId: data.id.toString(),
            status: 'PAID'
        };
    }
    async create(request) {
        const { amount, connector } = request;
        const { secret_key, api_key, shop_id } = connectorScheme.parse(connector.schema);
        const price = amount.toFixed(2);
        const currency = 'rub';
        const sign = crypto.createHash('sha1').update(currency + price + shop_id.value + secret_key.value).digest('hex');
        const uuid = uuidv4();
        const body = {
            currency,
            amount: price,
            uuid: uuid,
            shopId: shop_id.value,
            description: uuid,
            language: 'ru',
            items: [],
            sign
        };
        const request_link = 'https://mulenpay.ru/api/v2/payments';
        const response = await got.post(request_link, {
            headers: {
                Authorization: `Bearer ${api_key.value}`
            },
            json: body,
            retry: {
                limit: 4
            }
        }).json();
        if (response.success === false) throw ErrorAPI.badRequest('Provider success key is false');
        if (!response.paymentUrl) throw ErrorAPI.badRequest('Provider response missing required field "paymentUrl"');
        return {
            paymentId: response.id.toString(),
            paymentUrl: response.paymentUrl
        };
    }
}
