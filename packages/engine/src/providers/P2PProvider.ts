import { sample } from "@hfam/shared/helpers/sample";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import got from "got";
import z from "zod";
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from "./BaseProvider";

const ConnectorKeys = z.enum(["json_url"]);

export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);
export const cardSchema = z.object({
	digits: z.string(),
	bank: z.string(),
	owner: z.string(),
});

export const callbackScheme = z.object({
	status: z.enum(["SUCCESS"]),
	id: z.coerce.number().nonnegative(),
});

export class P2PProvider implements BaseProvider {
	async callback({
		request,
		connector,
	}: ProviderCallback): Promise<ProviderResponse> {
		return {};
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount, projectId, description, orderId, domain } =
			request;
		const { json_url } = connectorScheme.parse(connector.schema);

		const json = await got.get(json_url.value ?? "").json();

		// prettier-ignore
		const cards = z.array(cardSchema).parse(json);

		const card = sample(cards);

		const params = new URLSearchParams({
			digits: card.digits,
			bank: card.bank,
			owner: card.owner,
			amount: String(amount),
			projectId: String(projectId),
			description: description,
			orderId,
			domain,
		});

		const paymentUrl = `/gateway/p2p/?${params.toString()}`;

		return { paymentUrl: paymentUrl };
	}
}
