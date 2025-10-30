import email from "@fakerjs/email";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import got from "got";
import z from "zod";
import { handlePayCbLink } from "@/handlers/handlePayCbLink";
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from "./BaseProvider";

const ConnectorKeys = z.enum(["esell_token"]);

type EsellResponse = { id: number; success: boolean; location?: string };

export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);
export const callbackScheme = z.object({
	status: z.enum(["SUCCESS"]),
	id: z.coerce.number().nonnegative(),
});

export class EsellProvider implements BaseProvider {
	async callback({ request }: ProviderCallback): Promise<ProviderResponse> {
		const data = callbackScheme.parse(request.body);

		if (data.status !== "SUCCESS")
			throw ErrorAPI.badRequest("Callback expected status=SUCCESS");

		return { paymentId: data.id.toString(), status: "PAID" };
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload, connector } = request;
		const { esell_token } = connectorScheme.parse(connector.schema);

		const request_body = {
			json: {
				donate_url: esell_token.value,
				amount: amount,
				email: payload?.email ?? email({ domain: "gmail.com" }),
				callbackUrl: `${handlePayCbLink(connector.id)}?token=${esell_token.value}`,
			},
			retry: { limit: 4 },
		};

		const request_link = "https://esell.su/api/generatePaymentUrl";

		//biome-ignore format: :>
		const response = await got.post(request_link, request_body).json<EsellResponse>();
		//biome-ignore format: :>
		if (!response.location) throw ErrorAPI.badRequest('Provider missing "location"');

		return { paymentId: response.id.toString(), paymentUrl: response.location };
	}
}
