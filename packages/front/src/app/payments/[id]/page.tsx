"use server";

import type { PaymentDTO } from "@hfam/shared";
import checkApi from "@/actions/checkApi";
import { paymentsApi } from "../../../../api/paymentsApi";
import { projectsApi } from "../../../../api/projectsApi";
import "../../tables.css";

export default async function Payment({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await checkApi();
	const data = await params;
	const { id } = data;

	const projects = await projectsApi.getProjects();
	const payment = await paymentsApi.getPayment(id);

	const project = projects.filter((p) => p.id === payment.projectId)[0];

	const status = (status: PaymentDTO["status"]) => {
		switch (status) {
			case "CREATED":
				return "🟡 Создан";
			case "PAID":
				return "🟢 Оплачен";
			case "REFUND":
				return "🔴 Возврат";
			default:
				return "";
		}
	};

	if (!payment) {
		return (
			<section className="p-6">
				<h1 className="text-xl font-semibold text-red-500">Платёж не найден</h1>
			</section>
		);
	}

	return (
		<section className="text-sm p-4 overflow-hidden w-full max-w-[500px] py-5">
			<div className="flex flex-col border p-4 border-black/20 gap-2 w-full">
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">🆔 ID</span>
					<span className="font-bold">{payment.id}</span>
				</div>
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">📦 ID Заказа</span>
					<span className="font-bold">{payment.projectId}</span>
				</div>
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">🌐 Домен</span>
					<span className="font-bold">{payment.domain}</span>
				</div>
				<div className="flex  border-b border-black/20 items-center justify-between w-full">
					<span className="font-medium">🏢 Проект</span>
					<span className="font-bold">{project.name}</span>
				</div>
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">💳 Метод</span>
					<span className="font-bold">{payment.method}</span>
				</div>
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">📊 Статус</span>
					<span className="font-bold">{status(payment.status)}</span>
				</div>
				<div className="flex  border-b  border-black/20 items-center justify-between w-full">
					<span className="font-medium">💰 Сумма</span>
					<span className="font-bold">{payment.amount.toFixed()}</span>
				</div>

				<div className="flex items-center justify-between w-full">
					<span className="font-medium">🕒 Создан</span>
					<span className="font-bold">
						{new Date(payment.createdAt)
							.toISOString()
							.replace("T", " ")
							.slice(0, 19)}
					</span>
				</div>
				<div className="flex border-b border-black/20 items-center justify-between w-full">
					<span className="font-medium">📝 Описание</span>
					<span className="font-bold">{payment.description}</span>
				</div>

				<div className="flex items-center justify-between w-full">
					<span className="font-medium">🔗 Коннектор</span>
					<span className="font-bold">{payment.connector.name}</span>
				</div>
				<div className="flex items-center justify-between w-full">
					<span className="font-medium">🔌 Провайдер</span>
					<span className="font-bold">{payment.connector.byProvider}</span>
				</div>
				{payment.paymentUrl && (
					<a
						href={payment.paymentUrl}
						className="w-full text-center !text-blue-600 underline"
					>
						ССЫЛКА НА ОПЛАТУ
					</a>
				)}
			</div>
		</section>
	);
}
