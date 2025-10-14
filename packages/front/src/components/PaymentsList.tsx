"use client";

import type {
	DomainDTO,
	PaginationDTO,
	PaymentDTO,
	ProjectDTO,
} from "@hfam/shared/dto/index";
import type { FiltersSchemaType } from "@/app/payments/page";

type Props = {
	filters: FiltersSchemaType;
	payments: PaginationDTO<PaymentDTO>;
	projects: ProjectDTO[];
	domains: DomainDTO[];
};

export default function PaymentsList({
	filters,
	projects,
	domains,
	payments,
}: Props) {
	const project = (payment: PaymentDTO) => {
		return projects.filter((p) => p.id === payment.projectId)[0];
	};
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
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const params = new URLSearchParams();

					fd.forEach((v, k) => {
						if (v instanceof File) return; // файлов нет — пропускаем
						const s = String(v).trim();
						if (s !== "") params.append(k, s); // только непустые
					});

					window.location.search = params.toString();
				}}
				method="GET"
				className="flex gap-2 mb-4"
			>
				<input
					type="text"
					name="query"
					placeholder="Описание, ID..."
					className="border rounded-sm p-2"
					defaultValue={filters.query ?? ""}
				/>
				<div className="flex flex-col">
					<select
						name="projectId"
						defaultValue={filters.projectId?.toString() ?? ""}
						className="border h-full rounded-sm p-2"
					>
						<option value="">Проект</option>
						{projects.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col">
					<select
						name="domain"
						defaultValue={filters.domain?.toString() ?? ""}
						className="border h-full rounded-sm p-2"
					>
						<option value="">Домен</option>
						{domains.map((p) => (
							<option key={p.id} value={p.value}>
								{p.value}
							</option>
						))}
					</select>
				</div>

				<select
					name="status"
					defaultValue={filters.status ?? ""}
					className="border rounded-sm p-2"
				>
					<option value="">Все</option>
					<option value="CREATED">Создан</option>
					<option value="PAID">Оплачен</option>
					<option value="REFUND">Возврат</option>
				</select>
				<input
					type="date"
					name="createdFrom"
					defaultValue={
						filters.createdFrom
							? new Date(filters.createdFrom).toISOString().split("T")[0]
							: ""
					}
					className="border rounded-sm p-2"
					placeholder="от даты"
				/>
				<input
					type="date"
					name="createdTo"
					defaultValue={
						filters.createdTo
							? new Date(filters.createdTo).toISOString().split("T")[0]
							: ""
					}
					className="border rounded-sm p-2"
					placeholder="от даты"
				/>
				<button
					type="submit"
					className="cursor-pointer border px-4 rounded-sm bg-black  !text-white"
				>
					Фильтровать
				</button>
			</form>
			<table className="w-full text-sm">
				<thead>
					<tr>
						<th>🆔 ID</th>
						<th>📦 ID Заказа</th>
						<th>🏢 Проект</th>
						<th>💳 Метод</th>
						<th>📊 Статус</th>
						<th>💰 Сумма</th>
						<th>🌐 Домен</th>
						<th>🕒 Создан</th>
						<th>📝 Описание</th>
					</tr>
				</thead>
				<tbody>
					{payments.data.map((p) => (
						<tr key={p.id}>
							<td>
								<a
									className="!text-blue-500 underline"
									href={`/payments/${p.id}`}
								>
									{p.id}
								</a>
							</td>
							<td>{p.paymentId}</td>
							<td>{project(p).name}</td>
							<td>{p.method}</td>
							<td>{status(p.status)}</td>
							<td>{p.domain}</td>
							<td>
								{new Date(p.createdAt)
									.toISOString()
									.replace("T", " ")
									.slice(0, 19)}
							</td>
							<td>{p.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
