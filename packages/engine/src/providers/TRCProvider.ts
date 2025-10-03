import { ErrorAPI } from "@hfam/shared/helpers/error";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import z from "zod";
import type {
	BaseProvider,
	ProviderCallback,
	ProviderRequest,
	ProviderResponse,
} from "./BaseProvider";

const ConnectorKeys = z.enum(["trc_wallet"]);

export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);

export const callbackScheme = z.object({
	status: z.enum(["SUCCESS"]),
	id: z.coerce.number().nonnegative(),
});

export class TRCProvider implements BaseProvider {
	async callback({
		request,
		connector,
	}: ProviderCallback): Promise<ProviderResponse> {
		return {};
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount, description, orderId, domain, projectId } =
			request;
		const { trc_wallet } = connectorScheme.parse(connector.schema);

		if (!trc_wallet.value) throw ErrorAPI.badRequest("Wallet is required");

		const params = new URLSearchParams({
			amount: String(amount),
			projectId: String(projectId),
			description,
			orderId,
			domain,
			wallet: trc_wallet.value,
		});

		const paymentUrl = `/gateway/trc/?${params.toString()}`;

		return { paymentUrl: paymentUrl };
	}
}
