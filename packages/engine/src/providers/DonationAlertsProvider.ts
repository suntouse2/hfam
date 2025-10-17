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

export class DonationsAlertsProvider implements BaseProvider {
	async callback() {
		return {};
	}
	private async getProxyList(proxiesUrl: string): Promise<string[]> {
		try {
			const res = await got
				.get(proxiesUrl, { timeout: { request: 10_000 } })
				.json<string[]>();
			if (!Array.isArray(res)) throw new Error("Proxy list is not an array");
			return res;
		} catch (err) {
			console.warn("Failed to load proxy list:", (err as Error).message);
			return [];
		}
	}

	private getProxyAgent(proxy?: string) {
		if (!proxy) return undefined;
		try {
			const [host, port, username, password] = proxy.split(":");
			const auth = username && password ? `${username}:${password}@` : "";
			return new HttpsProxyAgent({
				proxy: `http://${auth}${host}:${port}`,
				keepAlive: false,
			});
		} catch {
			console.warn("Invalid proxy format:", proxy);
			return undefined;
		}
	}

	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload, connector } = request;
		const { id, proxies_url } = connectorScheme.parse(connector.schema);

		if (!proxies_url || !proxies_url.value)
			throw ErrorAPI.badRequest("Proxy url not provided");

		const proxies = await this.getProxyList(proxies_url.value);
		let proxyAgent = this.getProxyAgent(
			proxies[Math.floor(Math.random() * proxies.length)],
		);

		try {
			const createInvoice = await got
				.post("https://www.donationalerts.com/api/v1/payin/invoice", {
					agent: proxyAgent ? { https: proxyAgent } : undefined,
					json: {
						type: "donation",
						amount,
						currency: "RUB",
						user_id: id.value,
						message_type: "text",
						name: payload?.name ?? faker.internet.username(),
						donation_tts_voice_lang: "ru_RU",
						donation_tts_voice_id: 1,
						email: payload?.email ?? email({ domain: "gmail.com" }),
						system: "fasterPaymentsSystemSmgl",
						commission_covered: 0,
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
					error?: string;
				}>();

			if (!createInvoice.data) {
				console.error("DonationAlerts bad response:", createInvoice);
				throw ErrorAPI.badRequest("Invalid provider response");
			}

			const { invoice_id, hash, redirect_url, action } = createInvoice.data;
			if (redirect_url)
				return { paymentId: invoice_id.toString(), paymentUrl: redirect_url };
			if (action !== "wait") throw ErrorAPI.badRequest("Unexpected action");

			let finalUrl: string | undefined;
			for (let i = 0; i < 20; i++) {
				await new Promise((r) => setTimeout(r, 2000));
				proxyAgent = this.getProxyAgent(
					proxies[Math.floor(Math.random() * proxies.length)],
				);

				try {
					const check = await got
						.get("https://www.donationalerts.com/api/v1/payin/invoice", {
							searchParams: { type: "donation", id: invoice_id, hash },
							agent: proxyAgent ? { https: proxyAgent } : undefined,
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

			if (!finalUrl) throw ErrorAPI.badRequest("redirect_url not found");
			return { paymentId: invoice_id.toString(), paymentUrl: finalUrl };
		} catch (error) {
			console.error("DonationAlertsProvider.create error:", error);
			throw ErrorAPI.badRequest("Invalid provider response");
		}
	}
}
