"use client";

import type {
  DomainDTO,
  PaginationDTO,
  PaymentDTO,
  ProjectDTO,
} from "@hfam/shared/dto/index";
import { useState } from "react";
import type { FiltersSchemaType } from "@/app/payments/page";
import Payment from "./Payment";

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
  const [cPayment, setCPayment] = useState<null | PaymentDTO>(null);

  const project = (payment: PaymentDTO) =>
    projects.find((p) => p.id === payment.projectId);

  const status = (s: PaymentDTO["status"]) =>
    s === "CREATED"
      ? "🟡 Создан"
      : s === "PAID"
      ? "🟢 Оплачен"
      : s === "REFUND"
      ? "🔴 Возврат"
      : "";

  const currentPage = filters.page ?? 1;
  const totalPages = Math.ceil((payments.count || 0) / (filters.limit || 10));

  const buildParams = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) return;
      params.append(k, String(v));
    });
    params.set("page", String(page));
    return params.toString();
  };

  return (
    <div>
      {cPayment && (
        // biome-ignore lint/a11y/noStaticElementInteractions: fuck off
        // biome-ignore lint/a11y/useKeyWithClickEvents: fuck off
        <div
          className="fixed flex justify-center items-center w-full h-full left-0 top-0 z-20 bg-black/40"
          onClick={() => setCPayment(null)} // закрыть при клике по фону
        >
          {/** biome-ignore lint/a11y/noStaticElementInteractions: fuck off */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents:fuck off */}
          <div
            className="bg-white rounded-lg w-full max-w-[500px]"
            onClick={(e) => e.stopPropagation()} // клик внутри не закрывает
          >
            <Payment payment={cPayment} paymentProject={project(cPayment)} />
          </div>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const params = new URLSearchParams();

          fd.forEach((v, k) => {
            if (v instanceof File) return;
            const s = String(v).trim();
            if (s !== "") params.append(k, s);
          });

          window.location.search = params.toString();
        }}
        method="GET"
        className="flex flex-wrap gap-2 mb-4"
      >
        <input
          type="text"
          name="query"
          placeholder="Описание, ID..."
          className="border rounded-sm p-2"
          defaultValue={filters.query ?? ""}
        />

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

        <select
          name="domain"
          defaultValue={filters.domain ?? ""}
          className="border h-full rounded-sm p-2"
        >
          <option value="">Домен</option>
          {domains.map((d) => (
            <option key={d.id} value={d.value}>
              {d.value}
            </option>
          ))}
        </select>

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
          placeholder="до даты"
        />

        <button
          type="submit"
          className="cursor-pointer border px-4 rounded-sm bg-black !text-white"
        >
          Фильтровать
        </button>
      </form>

      {/* таблица */}
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">🆔 ID</th>
            <th className="border p-2">📦 ID Заказа</th>
            <th className="border p-2">🏢 Проект</th>
            <th className="border p-2">💳 Метод</th>
            <th className="border p-2">📊 Статус</th>
            <th className="border p-2">💰 Сумма</th>
            <th className="border p-2">🌐 Домен</th>
            <th className="border p-2">🕒 Создан</th>
            <th className="border p-2">📝 Описание</th>
          </tr>
        </thead>
        <tbody>
          {payments.data.map((p) => (
            <tr
              key={p.id}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
            >
              <td className="border p-2">
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={() => setCPayment(p)}
                >
                  {p.id}
                </button>
              </td>
              <td className="border p-2">{p.paymentId}</td>
              <td className="border p-2">{project(p)?.name ?? "-"}</td>
              <td className="border p-2">{p.method ?? "-"}</td>
              <td className="border p-2">{status(p.status)}</td>
              <td className="border p-2">
                {p.amount.toLocaleString("ru-RU")} ₽
              </td>
              <td className="border p-2">{p.domain}</td>
              <td className="border p-2">
                {new Date(p.createdAt)
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 19)}
              </td>
              <td className="border p-2">{p.description ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* пагинация */}
      <div className="flex justify-between items-center mt-4 text-sm">
        {currentPage > 1 ? (
          <a
            href={`?${buildParams(currentPage - 1)}`}
            className="text-blue-600 underline"
          >
            ← Назад
          </a>
        ) : (
          <span />
        )}

        <span>
          Страница {currentPage} из {totalPages || 1}
        </span>

        {currentPage < totalPages ? (
          <a
            href={`?${buildParams(currentPage + 1)}`}
            className="text-blue-600 underline"
          >
            Далее →
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
