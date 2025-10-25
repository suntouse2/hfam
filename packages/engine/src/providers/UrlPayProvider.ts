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

		if (data.payment_status !== "success") {
			console.log("Callback expected status=success");
			throw ErrorAPI.badRequest("Callback expected status=success");
		}

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

		const sign = crypto
			.createHash("sha1")
			.update(currency + price + shop_id.value + secret_key.value)
			.digest("hex");

		const uuid = uuidv4();

		const body = {
			currency,
			amount: price,
			uuid: uuid,
			shopId: shop_id.value,
			description: uuid,
			language: "ru",
			items: [],
			sign,
		};

		const request_link = "https://urlpay.io/api/v2/payments";

		const response = await got
			.post(request_link, {
				headers: { Authorization: `Bearer ${api_key.value}` },
				json: body,
				retry: { limit: 4 },
			})
			.json<{
				success: boolean;
				paymentUrl: string;
				id: number;
			}>();

		if (response.success === false)
			throw ErrorAPI.badRequest("Provider success key is false");

		if (!response.paymentUrl)
			throw ErrorAPI.badRequest(
				'Provider response missing required field "paymentUrl"',
			);

		return {
			paymentId: response.id.toString(),
			paymentUrl: response.paymentUrl,
		};
	}
}
