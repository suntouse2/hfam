import { DOMAIN } from "@hfam/shared";
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

const ConnectorKeys = z.enum(["tg_id"]);

export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);
export const cardSchema = z.object({
	digits: z.string(),
	end: z.string(),
	owner: z.string(),
});

export const callbackScheme = z.object({
	status: z.enum(["SUCCESS"]),
	id: z.coerce.number().nonnegative(),
});

export class TGProvider implements BaseProvider {
	async callback({
		request,
		connector,
	}: ProviderCallback): Promise<ProviderResponse> {
		return {};
	}
	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { connector, amount } = request;
		const { tg_id } = connectorScheme.parse(connector.schema);

		const sum = `${Number(amount).toLocaleString("ru-RU")} ₽`;

		const tg = tg_id.value?.replace("@", "");

		const paymentUrl = `https://t.me/${tg}?text=Здравствуйте, хочу купить товар! Укажите реквизиты на сумму ${sum}`;

		return { paymentUrl: paymentUrl };
	}
}
