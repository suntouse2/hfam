import { faker } from "@faker-js/faker";
import email from "@fakerjs/email";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import { connectorCredentialSchema } from "@hfam/shared/validation/connectors";
import got from "got";
import { HttpsProxyAgent } from "hpagent";
import z from "zod";
import type {
	BaseProvider,
	ProviderRequest,
	ProviderResponse,
} from "./BaseProvider";

const ConnectorKeys = z.enum(["id", "proxies_url"]);
export const connectorScheme = z.record(
	ConnectorKeys,
	connectorCredentialSchema,
);

export class DALinkProvider implements BaseProvider {
	async callback() {
		return {};
	}

	private async getProxyList(proxiesUrl: string): Promise<string[]> {
		try {
			const res = await got
				.get(proxiesUrl, { timeout: { request: 10_000 } })
				.json<string[]>();
			if (!Array.isArray(res) || res.length === 0)
				throw new Error("Proxy list invalid or empty");
			return res;
		} catch (err) {
			console.error("Failed to load proxy list:", (err as Error).message);
			throw ErrorAPI.badRequest("Proxy list unavailable");
		}
	}

	private getProxyAgent(proxy: string): HttpsProxyAgent {
		const [host, port, username, password] = proxy.split(":");
		if (!host || !port) throw ErrorAPI.badRequest("Invalid proxy format");
		const auth = username && password ? `${username}:${password}@` : "";
		return new HttpsProxyAgent({
			proxy: `http://${auth}${host}:${port}`,
			keepAlive: false,
		});
	}

	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload, connector } = request;
		const { id, proxies_url } = connectorScheme.parse(connector.schema);

		if (!proxies_url?.value)
			throw ErrorAPI.badRequest("Proxy URL not provided");

		const proxies = await this.getProxyList(proxies_url.value);
		if (proxies.length === 0) throw ErrorAPI.badRequest("Proxy list is empty");

		const randomProxy = (): string => {
			const proxy = proxies[Math.floor(Math.random() * proxies.length)];
			if (!proxy) throw ErrorAPI.badRequest("No valid proxy available");
			return proxy;
		};

		let proxyAgent = this.getProxyAgent(randomProxy());

		try {
			// 1️⃣ Первый запрос: DALink invoice/dalink
			const dalinkRes = await got
				.post("https://dalink.to/api/v1/payin/invoice/dalink", {
					agent: { https: proxyAgent },
					json: {
						user_id: Number(id.value),
						amount: amount.toString(),
						currency: "RUB",
						message_type: "text",
						name: payload?.name ?? faker.internet.username(),
					},
					timeout: { request: 10_000 },
					responseType: "json",
					throwHttpErrors: false,
				})
				.json<{ data?: { redirect_url: string } }>();

			if (!dalinkRes.data?.redirect_url) {
				console.error("DALink bad response:", dalinkRes);
				throw ErrorAPI.badRequest("Invalid DALink response");
			}

			// 2️⃣ Извлекаем параметры из redirect_url
			const url = new URL(dalinkRes.data.redirect_url);
			const client_id = url.searchParams.get("client_id");
			const signature = url.searchParams.get("signature");
			const data = url.searchParams.get("data");

			if (!client_id || !signature || !data)
				throw ErrorAPI.badRequest("Missing params from redirect_url");

			// 3️⃣ Создаём инвойс через DonationAlerts pwinvoice
			proxyAgent = this.getProxyAgent(randomProxy());
			const pwRes = await got
				.post("https://www.donationalerts.com/api/v1/payin/pwinvoice", {
					agent: { https: proxyAgent },
					json: {
						client_id,
						signature,
						data,
						email: payload?.email ?? email({ domain: "gmail.com" }),
						system: "fasterPaymentsSystemSmgl",
					},
					timeout: { request: 10_000 },
					responseType: "json",
					throwHttpErrors: false,
				})
				.json<{
					data?: {
						invoice_id: number;
						action: string;
						hash: string;
						redirect_url?: string;
					};
				}>();

			if (!pwRes.data) {
				console.error("DonationAlerts bad response:", pwRes);
				throw ErrorAPI.badRequest("Invalid provider response");
			}

			const { invoice_id, hash, redirect_url, action } = pwRes.data;
			if (redirect_url)
				return { paymentId: invoice_id.toString(), paymentUrl: redirect_url };

			if (action !== "wait")
				throw ErrorAPI.badRequest("Unexpected action from provider");

			// 4️⃣ Polling /invoice
			let finalUrl: string | undefined;
			for (let i = 0; i < 20; i++) {
				await new Promise((r) => setTimeout(r, 2000));
				proxyAgent = this.getProxyAgent(randomProxy());

				try {
					const check = await got
						.get("https://www.donationalerts.com/api/v1/payin/invoice", {
							searchParams: { type: "donation", id: invoice_id, hash },
							agent: { https: proxyAgent },
							timeout: { request: 8000 },
							responseType: "json",
							throwHttpErrors: false,
						})
						.json<{ data?: { redirect_url?: string } }>();

					if (check.data?.redirect_url) {
						finalUrl = check.data.redirect_url;
						break;
					}
				} catch (err) {
					console.warn("proxy failed:", (err as Error).message);
				}
			}

			if (!finalUrl)
				throw ErrorAPI.badRequest("redirect_url not found after polling");

			return {
				paymentId: invoice_id.toString(),
				paymentUrl: finalUrl,
			};
		} catch (error) {
			console.error("DALinkProvider.create error:", error);
			throw ErrorAPI.badRequest("Invalid provider response");
		}
	}
}
