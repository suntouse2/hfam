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
	async callback(): Promise<ProviderResponse> {
		return {};
	}

	private async getProxyAgent(
		proxiesUrl: string,
	): Promise<HttpsProxyAgent | undefined> {
		try {
			const proxyList = await got
				.get(proxiesUrl, { timeout: { request: 10_000 } })
				.json<string[]>();
			if (!Array.isArray(proxyList) || proxyList.length === 0) return undefined;

			const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
			if (!proxy) throw ErrorAPI.badRequest("no proxy");
			const [host, port, username, password] = proxy.split(":");
			const proxyAuth = username && password ? `${username}:${password}@` : "";

			return new HttpsProxyAgent({
				proxy: `http://${proxyAuth}${host}:${port}`,
				keepAlive: false,
			});
		} catch (err) {
			console.warn("Failed to load or parse proxies:", (err as Error).message);
			return undefined;
		}
	}

	async create(request: ProviderRequest): Promise<ProviderResponse> {
		const { amount, payload, connector } = request;
		const { id, proxies_url } = connectorScheme.parse(connector.schema);
		const fromEmail = payload?.email ?? email({ domain: "gmail.com" });

		try {
			// --- Выбор случайного прокси ---
			const proxyAgent = await this.getProxyAgent(proxies_url.value ?? "");

			// --- 1. Создание инвойса ---
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
						email: fromEmail,
						system: "fasterPaymentsSystemSmgl",
						commission_covered: 0,
					},
					timeout: { request: 10_000 },
					responseType: "json",
				})
				.json<{
					data: {
						invoice_id: number;
						is_paid: number;
						action: string;
						hash: string;
						redirect_url?: string;
					};
				}>();

			const { invoice_id, hash, redirect_url, action } = createInvoice.data;

			if (redirect_url) {
				return { paymentId: invoice_id.toString(), paymentUrl: redirect_url };
			}

			if (action !== "wait") {
				console.error("Unexpected provider response:", createInvoice);
				throw ErrorAPI.badRequest("Invalid provider response");
			}

			// --- 2. Polling ---
			let finalUrl: string | undefined;
			for (let i = 0; i < 20; i++) {
				await new Promise((r) => setTimeout(r, 2000));

				try {
					const checkAgent = await this.getProxyAgent(proxies_url.value ?? "");
					const getInvoice = await got
						.get("https://www.donationalerts.com/api/v1/payin/invoice", {
							agent: checkAgent ? { https: checkAgent } : undefined,
							searchParams: { type: "donation", id: invoice_id, hash },
							timeout: { request: 8000 },
							retry: {
								limit: 3,
								methods: ["GET"],
								statusCodes: [408, 429, 500, 502, 503, 504],
								calculateDelay: ({ attemptCount }) => attemptCount * 1000,
							},
							responseType: "json",
						})
						.json<{ data: { redirect_url?: string } }>();

					if (getInvoice.data.redirect_url) {
						finalUrl = getInvoice.data.redirect_url;
						break;
					}
				} catch (err) {
					console.warn("Retry error:", (err as Error).message);
				}
			}

			if (!finalUrl) {
				console.error("redirect_url not found after polling");
				throw ErrorAPI.badRequest("Invalid provider response");
			}

			return { paymentId: invoice_id.toString(), paymentUrl: finalUrl };
		} catch (error) {
			console.error("DonationAlertsProvider.create error:", error);
			throw ErrorAPI.badRequest("Invalid provider response");
		}
	}
}
