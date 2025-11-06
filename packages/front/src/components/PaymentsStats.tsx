"use client";

import {
  CheckCircle2,
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type PaymentDTO = {
  id: string;
  status: "CREATED" | "PAID" | "REFUND";
  amount: number;
  createdAt: string | Date;
};

export default function PaymentsStats({
  stats,
}: {
  stats: { count: number; totalAmount: number; data: PaymentDTO[] };
}) {
  const data = stats.data.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));

  // определить начало текущего дня и 6 предыдущих
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 })
    .map((_, i) => {
      const date = new Date(startOfToday);
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      const dayPayments = data.filter(
        (p) => p.createdAt >= start && p.createdAt < end
      );
      const paid = dayPayments.filter((p) => p.status === "PAID");
      const sum = paid.reduce((acc, p) => acc + p.amount, 0);

      return {
        date,
        total: dayPayments.length,
        paid: paid.length,
        earned: sum,
      };
    })
    .reverse(); // чтобы понедельник → воскресенье шли слева направо

  // средние значения за неделю
  const avgTotal = +(days.reduce((a, b) => a + b.total, 0) / 7).toFixed(2);
  const avgPaid = +(days.reduce((a, b) => a + b.paid, 0) / 7).toFixed(2);
  const avgEarn = +(days.reduce((a, b) => a + b.earned, 0) / 7).toFixed(2);

  const diff = (val: number, avg: number) =>
    avg ? +(((val - avg) / avg) * 100).toFixed(1) : 0;

  return (
    <section className="overflow-x-auto mb-8">
      <div className="flex flex-col min-w-[900px] justify-between bg-white border border-gray-200 rounded-xl p-4">
        {days.map((day) => {
          const tDiff = diff(day.total, avgTotal);
          const pDiff = diff(day.paid, avgPaid);
          const eDiff = diff(day.earned, avgEarn);
          const dateLabel = day.date.toLocaleDateString("ru-RU", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          });

          return (
            <div
              key={day.date.toISOString()}
              className="flex w-full items-center justify-between gap-2 p-3 border-r border-gray-100 last:border-r-0 w-[120px]"
            >
              <div className="font-semibold text-gray-700 text-sm">
                {dateLabel}
              </div>

              <div className="text-center text-gray-800">
                <div className="flex items-center justify-center gap-1 text-sm font-medium">
                  <CreditCard className="w-4 h-4 text-blue-500" /> {day.total}
                </div>
                <span
                  className={`text-xs ${
                    tDiff > 0
                      ? "text-green-600"
                      : tDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {tDiff > 0 ? "+" : ""}
                  {tDiff}%
                </span>
              </div>

              <div className="text-center text-gray-800">
                <div className="flex items-center justify-center gap-1 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> {day.paid}
                </div>
                <span
                  className={`text-xs ${
                    pDiff > 0
                      ? "text-green-600"
                      : pDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {pDiff > 0 ? "+" : ""}
                  {pDiff}%
                </span>
              </div>

              <div className="text-center text-gray-800">
                <div className="flex items-center justify-center gap-1 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  {day.earned.toLocaleString("ru-RU")}
                </div>
                <span
                  className={`text-xs ${
                    eDiff > 0
                      ? "text-green-600"
                      : eDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {eDiff > 0 ? "+" : ""}
                  {eDiff}%
                </span>
              </div>

              <div className="mt-1 text-xs text-gray-400">
                {tDiff > 0 && (
                  <TrendingUp size={12} className="inline text-green-500" />
                )}
                {tDiff < 0 && (
                  <TrendingDown size={12} className="inline text-red-500" />
                )}
                {tDiff === 0 && "—"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-600 flex justify-between">
        <div>
          Средние: транзакций {avgTotal}, успешных {avgPaid}, заработок{" "}
          {avgEarn.toLocaleString("ru-RU")} ₽
        </div>
      </div>
    </section>
  );
}
