import type { ConnectorDTO } from "@hfam/shared/dto/index";
import { InlineKeyboard } from "grammy";

type ConnectorStatus = {
	connector: ConnectorDTO;
	status: string;
	paymentUuid: string | null;
	paymentUrl: string | null;
};

function escapeHtml(text: string) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export default function viewPaymentTest(connectorStatuses: ConnectorStatus[]) {
	const lines = ["🔌 <b>Тестирование платежей:</b>\n\n"];

	connectorStatuses.forEach((c) => {
		const name = escapeHtml(c.connector.name);
		const status = escapeHtml(c.status);
		const uuid = c.paymentUuid
			? `\n🔑 <code>${escapeHtml(c.paymentUuid)}</code>`
			: "";
		const url = c.paymentUrl
			? `\n🔗 <a href="${escapeHtml(c.paymentUrl)}">Открыть платёж</a>`
			: "";

		lines.push(`• <b>${name}</b> — ${status}${uuid}${url}`);
	});

	const kb = new InlineKeyboard().text("⬅️ Назад", "connectors");

	return {
		message: lines.join("\n\n"),
		kb,
		parse_mode: "HTML",
	};
}
