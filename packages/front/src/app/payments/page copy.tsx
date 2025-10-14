/** biome-ignore-all lint/a11y/noLabelWithoutControl: fuck */
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { domainsApi } from "../../../api/domainsApi";
import { paymentsApi } from "../../../api/paymentsApi";
import { projectsApi } from "../../../api/projectsApi";

const FiltersSchema = z.object({
	api_key: z.string().optional(),
	page: z.coerce.number().default(1),
	limit: z.coerce.number().default(10),
	status: z.enum(["CREATED", "PAID", "REFUND"]).optional(),
	projectId: z.coerce.number().optional(),
	query: z.string().trim().optional(),
	domain: z.string().trim().optional(),
});

export default async function Payments({
	searchParams,
}: {
	searchParams: Record<string, string | undefined>;
}) {
	const parsed = FiltersSchema.safeParse(searchParams);
	if (!parsed.success) redirect("/");

	const { api_key, page, limit, status, projectId, query, domain } =
		parsed.data;

	const validKey =
		process.env.API_KEY ?? "i5WppvEaqmuoIcdcXF8vv1ZCi5WEaqppvmuoIcd9mvySH";
	if (api_key !== validKey) redirect("/");

	const filters = Object.fromEntries(
		Object.entries({ projectId, status, query, domain }).filter(
			([, v]) => v !== undefined && v !== "",
		),
	);

	const [payments, projects, domains] = await Promise.all([
		paymentsApi.getPayments(filters, page, limit),
		projectsApi.getProjects(),
		domainsApi.getDomains(projectId ? { projectId } : {}),
	]);

	const totalCount = payments.count ?? 0;
	const todayCount = payments.data.filter((p) => {
		const d = new Date(p.createdAt);
		const n = new Date();
		return (
			d.getDate() === n.getDate() &&
			d.getMonth() === n.getMonth() &&
			d.getFullYear() === n.getFullYear()
		);
	}).length;

	return (
		<section className="min-h-screen bg-[#f3f4f6] py-10 px-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Заголовок и статистика */}
				<div className="bg-white rounded-3xl p-6">
					<h1 className="text-2xl font-bold mb-4">💳 Все транзакции</h1>
					<div className="flex flex-wrap gap-6 text-sm text-gray-700">
						<p>
							<b>Всего:</b> {totalCount}
						</p>
						<p>
							<b>Сегодня:</b> {todayCount}
						</p>
					</div>
				</div>

				{/* Фильтры */}
				<form
					method="GET"
					className="bg-white rounded-3xl p-6 flex flex-wrap gap-3 items-end"
				>
					<input type="hidden" name="api_key" value={api_key} />

					<div className="flex flex-col">
						<label className="text-xs text-gray-600 mb-1">Поиск</label>
						<input
							type="text"
							name="query"
							placeholder="Описание, ID..."
							defaultValue={query ?? ""}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-xs text-gray-600 mb-1">Статус</label>
						<select
							name="status"
							defaultValue={status ?? ""}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Все</option>
							<option value="CREATED">Создан</option>
							<option value="PAID">Оплачен</option>
							<option value="REFUND">Возврат</option>
						</select>
					</div>

					<div className="flex flex-col">
						<label className="text-xs text-gray-600 mb-1">Проект</label>
						<select
							name="projectId"
							defaultValue={projectId?.toString() ?? ""}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Все</option>
							{projects.map((p) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col">
						<label className="text-xs text-gray-600 mb-1">Домен</label>
						<select
							name="domain"
							defaultValue={domain ?? ""}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Все</option>
							{domains.map((d) => (
								<option key={d.id} value={d.value}>
									{d.value}
								</option>
							))}
						</select>
					</div>

					<button
						type="submit"
						className="bg-blue-500 text-white font-medium text-sm rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
					>
						Фильтровать
					</button>
				</form>

				{/* Таблица */}
				<div className="bg-white rounded-3xl p-6 overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="text-gray-500 text-xs uppercase border-b">
								<th className="py-3 text-left">ID</th>
								<th className="py-3 text-left">Order ID</th>
								<th className="py-3 text-left">Method</th>
								<th className="py-3 text-left">Status</th>
								<th className="py-3 text-left">Amount</th>
								<th className="py-3 text-left">Domain</th>
								<th className="py-3 text-left">Created</th>
								<th className="py-3 text-left">Description</th>
							</tr>
						</thead>
						<tbody>
							{payments.data.length ? (
								payments.data.map((p) => (
									<tr
										key={p.id}
										className="border-b last:border-none hover:bg-gray-50 transition"
									>
										<td className="py-2">{p.id}</td>
										<td>{p.orderId}</td>
										<td>{p.method ?? "-"}</td>
										<td>
											<span
												className={`font-semibold ${
													p.status === "PAID"
														? "text-green-600"
														: p.status === "REFUND"
															? "text-red-600"
															: "text-yellow-600"
												}`}
											>
												{p.status}
											</span>
										</td>
										<td>{p.amount}</td>
										<td>{p.domain}</td>
										<td>{new Date(p.createdAt).toLocaleString()}</td>
										<td>{p.description}</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={8}
										className="text-center text-gray-500 py-6 text-sm"
									>
										Нет данных
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Пагинация */}
				<div className="bg-white rounded-3xl p-6 flex justify-between items-center text-sm">
					{page > 1 ? (
						<a
							href={`?api_key=${api_key}&page=${page - 1}&limit=${limit}`}
							className="text-blue-500 hover:underline"
						>
							← Назад
						</a>
					) : (
						<div />
					)}

					<span className="text-gray-700">Страница {page}</span>

					{payments.data.length === limit ? (
						<a
							href={`?api_key=${api_key}&page=${page + 1}&limit=${limit}`}
							className="text-blue-500 hover:underline"
						>
							Далее →
						</a>
					) : (
						<div />
					)}
				</div>
			</div>
		</section>
	);
}
