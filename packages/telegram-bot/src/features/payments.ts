/** biome-ignore-all lint/style/noNonNullAssertion: no need to explain */

import type { ConnectorDTO } from "@hfam/shared/dto/index";
import { HTTPError } from "got";
import { Composer } from "grammy";
import { nanoid } from "nanoid";
import { connectorsApi } from "@/api/connectorsApi";
import { domainsApi } from "@/api/domainsApi";
import { payApi } from "@/api/payApi";
import type { MyContext } from "@/bot";
import viewPaymentsList from "@/views/PaymentsList";
import viewPaymentTest from "@/views/PaymentTest";

export const payments = new Composer<MyContext>();

payments.callbackQuery(/^payments:(\d+)$/, async (ctx) => {
	await ctx.answerCallbackQuery();
	const { projectId } = ctx.session;
	if (!projectId) return;

	const page = parseInt(ctx.match[1]!, 10) || 1;
	const { message, kb } = await viewPaymentsList(projectId, page);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});

payments.callbackQuery("payments:connector", async (ctx) => {
	await ctx.answerCallbackQuery();
	const { projectId, connectorId } = ctx.session;
	if (!projectId || !connectorId) return ctx.reply("❌ Не выбран коннектор");

	const domains = await domainsApi.getDomains({ projectId });
	if (!domains.length) return ctx.reply("😔 Нет доступных доменов");

	const connector = await connectorsApi.getConnector(connectorId);
	if (!connector) return ctx.reply("❌ Коннектор не найден");

	const status = "🔄 Создание платежа";
	let paymentUuid: string | null = null;
	let paymentUrl: string | null = null;

	const update = async (text: string) => {
		await ctx.editMessageText(
			[
				`🌐 <b>${connector.name}</b>`,
				`Провайдер ID: ${connector.id}`,
				`Статус: ${text}`,
				paymentUrl ? `🔗 <a href="${paymentUrl}">Перейти к оплате</a>` : "",
			]
				.filter(Boolean)
				.join("\n"),
			{ parse_mode: "HTML" },
		);
	};

	await update(status);

	try {
		const p = await payApi.pay({
			domain: domains[0]?.value || "",
			orderId: nanoid(),
			amount: 10,
			description: "Тестовый платёж",
			projectId,
			connectorId,
		});
		paymentUuid = p.id;
		paymentUrl = p.paymentUrl;
		await update("✅ Платёж создан");
	} catch (e) {
		const msg =
			e instanceof HTTPError && e.response.body?.error
				? e.response.body.error
				: "Ошибка";
		await update("❌ " + msg);
	}
});

payments.callbackQuery("payments:test", async (ctx) => {
	await ctx.answerCallbackQuery();
	const { projectId } = ctx.session;
	if (!projectId) return;
	const domains = await domainsApi.getDomains({ projectId });
	const connectors = await connectorsApi.getConnectors({
		projectId,
		active: true,
	});
	if (!connectors.length) return ctx.reply("😔 Нет доступных провайдеров");

	const statuses = connectors.map((c) => ({
		connector: c,
		status: "⏳ Ожидание платежа",
		paymentUuid: null as string | null,
		paymentUrl: null as string | null,
	}));

	if (!domains.length) return ctx.reply("😔 Нет доступных доменов");

	const update = async (
		id: ConnectorDTO["id"],
		status: string,
		uuid: string | null,
		url: string | null,
	) => {
		const s = statuses.find((v) => v.connector.id === id);
		if (!s) return;
		Object.assign(s, { status, paymentUuid: uuid, paymentUrl: url });
		const { message, kb } = viewPaymentTest(statuses);
		await ctx.editMessageText(message, {
			reply_markup: kb,
			parse_mode: "HTML",
		});
	};

	for (const c of connectors) {
		await update(c.id, "🔄 Создание платежа", null, null);
		try {
			const p = await payApi.pay({
				domain: domains[0]?.value || "",
				orderId: nanoid(),
				amount: 10,
				description: "Тестовый платёж",
				projectId,
				connectorId: c.id,
			});
			await update(c.id, "✅ Платёж создан", p.id, p.paymentUrl);
		} catch (e) {
			const msg =
				e instanceof HTTPError && e.response.body?.error
					? e.response.body.error
					: "Ошибка";
			// biome-ignore lint/style/useTemplate: shut a fuck up
			await update(c.id, "❌ " + msg, null, null);
		}
	}
});
