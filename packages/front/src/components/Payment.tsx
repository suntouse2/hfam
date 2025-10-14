import type { PaymentDTO, ProjectDTO } from "@hfam/shared";

export default function Payment({
	payment,
	paymentProject,
}: {
	payment: PaymentDTO;
	paymentProject?: ProjectDTO;
}) {
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

	return (
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
				<span className="font-bold">{paymentProject?.name}</span>
			</div>
			<div className="flex items-center justify-between w-full">
				<span className="font-medium">💳 Метод</span>
				<span className="font-bold">{payment.method}</span>
			</div>
			<div className="flex items-center justify-between w-full">
				<span className="font-medium">📊 Статус</span>
				<span className="font-bold">{status(payment.status)}</span>
			</div>
			<div className="flex items-center justify-between w-full">
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
			<div className="flex border-black/20 items-center justify-between w-full">
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
	);
}
