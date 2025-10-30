import email from "@fakerjs/email";
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
	"project_id",
	"secret_id",
	"secret_key",
	"callback_key",
]);

const connectorScheme = z.record(ConnectorKeys, connectorCredentialSchema);

const callbackScheme = z.object({
	status: z.enum(["SUCCESS", "FAIL"]),
	payment_id: z.string(),
});

export class AntilopayProvider implements BaseProvider {
	async callback({
		request,
		connector,
	}: ProviderCallback): Promise<ProviderResponse> {
		const signature = request.header("X-Apay-Sign");
		if (!signature) throw ErrorAPI.badRequest("Invalid signature");

		const { callback_key } = connectorScheme.parse(connector.schema);

		if (!callback_key.value)
			throw ErrorAPI.badRequest("callback_key is required");

		const pubKey = crypto.createPublicKey({
			key: Buffer.from(callback_key.value, "base64"),
			format: "der",
			type: "spki",
		});
		const verifier = crypto.createVerify("RSA-SHA256");
		const bodyString = JSON.stringify(request.body);
		verifier.update(bodyString);
		const valid = verifier.verify(pubKey, signature, "base64");
		if (!valid) throw ErrorAPI.badRequest("Invalid signature");

		const data = callbackScheme.parse(request.body);
		if (data.status !== "SUCCESS") return {};

		return { paymentId: data.payment_id, status: "PAID" };
	}

	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload: reqPayload, connector } = request;
		const { secret_key, secret_id, project_id } = connectorScheme.parse(
			connector.schema,
		);

		if (!secret_key.value || !project_id.value || !secret_id.value)
			throw ErrorAPI.badRequest(
				"secret_key, project_id, secret_id are required",
			);

		const body = JSON.stringify({
			project_identificator: project_id.value,
			amount,
			order_id: uuidv4(),
			currency: "RUB",
			product_name: "Покупка кейса",
			product_type: "goods",
			description: "Покупка кейса",
			customer: {
				email: reqPayload?.email ?? email({ domain: "gmail.com" }),
			},
		});

		// Подписание прямо здесь
		const privKey = crypto.createPrivateKey({
			key: Buffer.from(secret_key.value, "base64"),
			format: "der",
			type: "pkcs8",
		});
		const signature = crypto
			.sign("RSA-SHA256", Buffer.from(body), privKey)
			.toString("base64");

		const res = await got
			.post("https://lk.antilopay.com/api/v1/payment/create", {
				headers: {
					"Content-Type": "application/json",
					"X-Apay-Secret-Id": secret_id.value,
					"X-Apay-Sign": signature,
					"X-Apay-Sign-Version": "1",
				},
				body,
			})
			.json<{ payment_id: string; payment_url: string }>();

		return {
			paymentId: res.payment_id,
			paymentUrl: res.payment_url,
		};
	}
}
