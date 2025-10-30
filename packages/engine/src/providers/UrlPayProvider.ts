import { ErrorAPI } from "@hfam/shared/helpers/error";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import crypto from "crypto";
import got from "got";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from "./BaseProvider";

const ConnectorKeys = z.enum([
	"shop_id",
	"secret_key",
	"api_key",
	"success_callback",
]);

type UrlPayResponse = {
	success: boolean;
	paymentUrl: string;
	id: number;
};

export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);
export const callbackScheme = z.object({
	id: z.coerce.number().nonnegative(),
	amount: z.coerce.number(),
	currency: z.string(),
	uuid: z.string(),
	payment_status: z.enum(["success", "cancel"]),
});

export class UrlPayProvider implements BaseProvider {
	async callback({
		request,
		connector,
	}: ProviderCallback): Promise<ProviderResponse> {
		const { success_callback } = connectorScheme.parse(connector.schema);
		const data = callbackScheme.parse(request.body);

		if (data.payment_status !== "success")
			throw ErrorAPI.badRequest("Callback expected status=success");

		return {
			paymentId: data.id.toString(),
			status: "PAID",
			callback: success_callback.value,
		};
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, connector } = request;
		const { secret_key, api_key, shop_id } = connectorScheme.parse(
			connector.schema,
		);

		const price = amount.toFixed(2);
		const currency = "rub";

		//biome-ignore format: :>
		const sign = crypto.createHash("sha1").update(currency + price + shop_id.value + secret_key.value).digest("hex");

		const uuid = uuidv4();

		const urlpay_link = "https://urlpay.io/api/v2/payments";

		const urlpay_request = {
			headers: { Authorization: `Bearer ${api_key.value}` },
			json: {
				currency,
				amount: price,
				uuid: uuid,
				shopId: shop_id.value,
				description: uuid,
				language: "ru",
				items: [],
				sign,
			},
			retry: { limit: 4 },
		};

		//biome-ignore format: :>
		const response = await got.post(urlpay_link, urlpay_request).json<UrlPayResponse>();

		if (response.success === false)
			throw ErrorAPI.badRequest("Provider success key is false");

		if (!response.paymentUrl)
			throw ErrorAPI.badRequest('Provider response missing  "paymentUrl"');

		return {
			paymentId: response.id.toString(),
			paymentUrl: response.paymentUrl,
		};
	}
}
