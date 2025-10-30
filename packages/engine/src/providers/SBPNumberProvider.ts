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
export const numberSchema = z.object({
	number: z.string(),
	bank: z.string(),
	owner: z.string(),
});

export const callbackScheme = z.object({
	status: z.enum(["SUCCESS"]),
	id: z.coerce.number().nonnegative(),
});

export class SBPNumberProvider implements BaseProvider {
	async callback(): Promise<ProviderResponse> {
		return {};
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount, projectId, description, orderId, domain } =
			request;
		const { json_url } = connectorScheme.parse(connector.schema);

		const json = await got.get(json_url.value ?? "").json();

		const numbers = z.array(numberSchema).parse(json);

		const { number, owner, bank } = sample(numbers);

		const params = new URLSearchParams({
			number,
			owner,
			bank,
			amount: String(amount),
			projectId: String(projectId),
			description,
			orderId,
			domain,
		});

		const paymentUrl = `/gateway/sbp/?${params.toString()}`;

		return { paymentUrl: paymentUrl };
	}
}
