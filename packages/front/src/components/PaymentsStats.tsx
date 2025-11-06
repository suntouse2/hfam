"use client";
import { CheckCircle2, CircleDollarSign, CreditCard } from "lucide-react";

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

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }).map((_, i) => {
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

    const weekday = date.toLocaleDateString("ru-RU", { weekday: "long" });
    const label =
      i === 0
        ? `Сегодня, ${weekday}`
        : i === 1
        ? `Вчера, ${weekday}`
        : `${date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
          })} ${weekday}`;

    return {
      label,
      total: dayPayments.length,
      paid: paid.length,
      earned: sum,
      date,
    };
  });

  const avgTotal = +(
    days.reduce((acc, d) => acc + d.total, 0) / days.length
  ).toFixed(2);
  const avgPaid = +(
    days.reduce((acc, d) => acc + d.paid, 0) / days.length
  ).toFixed(2);
  const avgEarn = +(
    days.reduce((acc, d) => acc + d.earned, 0) / days.length
  ).toFixed(2);

  const report = days.reduce((acc, d) => {
    acc[d.label] = {
      total: d.total,
      totalDiff: +(d.total - avgTotal).toFixed(2),
      paid: d.paid,
      paidDiff: +(d.paid - avgPaid).toFixed(2),
      earned: d.earned,
      earnedDiff: +(d.earned - avgEarn).toFixed(2),
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <section className="max-w-[1200px] mx-auto mt-6">
      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(report).map(([day, d]) => (
          <div
            key={day}
            className="rounded-2xl p-5 shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="font-bold text-lg text-gray-800 mb-3 capitalize">
              {day}
            </h2>

            {/* Транзакции */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Транзакций</span>
              </div>
              <div className="text-right">
                <span className="text-base font-semibold text-gray-900">
                  {d.total}
                </span>{" "}
                <span
                  className={`text-sm font-semibold ${
                    d.totalDiff > 0
                      ? "text-green-600"
                      : d.totalDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {d.totalDiff > 0 ? `+${d.totalDiff}` : d.totalDiff}
                </span>
              </div>
            </div>

            {/* Успешные */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Успешных</span>
              </div>
              <div className="text-right">
                <span className="text-base font-semibold text-gray-900">
                  {d.paid}
                </span>{" "}
                <span
                  className={`text-sm font-semibold ${
                    d.paidDiff > 0
                      ? "text-green-600"
                      : d.paidDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {d.paidDiff > 0 ? `+${d.paidDiff}` : d.paidDiff}
                </span>
              </div>
            </div>

            {/* Заработано */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <CircleDollarSign className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">Заработано</span>
              </div>
              <div className="text-right">
                <span className="text-base font-semibold text-gray-900">
                  {d.earned.toLocaleString("ru-RU")} ₽
                </span>{" "}
                <span
                  className={`text-sm font-semibold ${
                    d.earnedDiff > 0
                      ? "text-green-600"
                      : d.earnedDiff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {d.earnedDiff > 0 ? `+${d.earnedDiff}` : d.earnedDiff} ₽
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Плашка средних */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 shadow-sm text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="font-medium text-gray-600">Средние за неделю:</span>
        <div className="mt-2 sm:mt-0 space-x-6">
          <span className="font-semibold text-gray-900">
            Транзакций {avgTotal}
          </span>
          <span className="font-semibold text-gray-900">
            Успешных {avgPaid}
          </span>
          <span className="font-semibold text-gray-900">
            Заработок {avgEarn.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
    </section>
  );
}
