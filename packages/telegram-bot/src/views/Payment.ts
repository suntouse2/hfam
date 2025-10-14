import type { PaymentDTO } from "@hfam/shared";
import { projectsApi } from "@/api/projectsApi";

export default async function viewPayment(payment: PaymentDTO) {
	const project = await projectsApi.getProject(payment.projectId);
	let status = "";

	switch (payment.status) {
		case "CREATED":
			status = "🟡 Создан";
			break;
		case "PAID":
			status = "🟢 Платёж получен";
			break;
	}

	const lines = [
		`<b>💳 Платёж #${payment.id}</b>`,
		`${payment.paymentId ? `Внешний ID: ${payment.paymentId}` : ""}\n`,

		`Проект: <b>${project.name}</b> (ID: ${project.id})`,
		`Домен: <b>${payment.domain}</b>`,
		`Провайдер: <b>${payment.connector.name}</b>`,
		`Метод: <b>${payment.method || "—"}</b>\n`,

		`Сумма: <b>${payment.amount}</b>`,
		`Статус: <b>${status}</b>\n`,

		`Создан: <b>${payment.createdAt.toLocaleString()}</b>`,
		`Обновлён: <b>${payment.updatedAt.toLocaleString()}</b>`,
	].join("\n");

	return {
		message: lines,
	};
}
