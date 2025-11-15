"use client";
import {
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

type PaymentDTO = {
  id: string;
  status: "CREATED" | "PAID" | "REFUND";
  amount: number;
  createdAt: string | Date;
};

const MSK_OFFSET = 3 * 60 * 60 * 1000;

const toMSK = (date: Date) => new Date(date.getTime() + MSK_OFFSET);

const startOfMSKDay = (d: Date) => {
  const m = toMSK(d);
  return new Date(
    Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), m.getUTCDate())
  );
};

export default function PaymentsStats({
  stats,
}: {
  stats: { count: number; totalAmount: number; data: PaymentDTO[] };
}) {
  const [report, setReport] = useState<Record<string, any> | null>(null);
  const [averages, setAverages] = useState<{
    avgTotal: number;
    avgPaid: number;
    avgEarn: number;
    avgNet: number;
  } | null>(null);

  useEffect(() => {
    const data = stats.data.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));

    const nowMSK = toMSK(new Date());
    const startTodayMSK = startOfMSKDay(nowMSK);

    const days = Array.from({ length: 7 }).map((_, i) => {
      const start = new Date(startTodayMSK);
      start.setUTCDate(start.getUTCDate() - i);

      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      const dayPayments = data.filter((p) => {
        const dt = toMSK(p.createdAt);
        return dt >= start && dt < end;
      });

      const paid = dayPayments.filter((p) => p.status === "PAID");
      const sum = paid.reduce((acc, p) => acc + p.amount, 0);
      const net = +(sum * 0.925).toFixed(2);

      const weekday = start.toLocaleDateString("ru-RU", {
        weekday: "long",
        timeZone: "UTC",
      });

      const label =
        i === 0
          ? `Сегодня, ${weekday}`
          : i === 1
          ? `Вчера, ${weekday}`
          : `${start.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              timeZone: "UTC",
            })} ${weekday}`;

      return {
        label,
        total: dayPayments.length,
        paid: paid.length,
        earned: sum,
        net,
      };
    });

    const avg = (key: keyof (typeof days)[number]) =>
      +(
        days.reduce((acc, d) => acc + (d[key] as number), 0) / days.length
      ).toFixed(2);

    const avgTotal = avg("total");
    const avgPaid = avg("paid");
    const avgEarn = avg("earned");
    const avgNet = avg("net");

    const rep = days.reduce((acc, d) => {
      acc[d.label] = {
        total: d.total,
        totalDiff: +(d.total - avgTotal).toFixed(2),
        paid: d.paid,
        paidDiff: +(d.paid - avgPaid).toFixed(2),
        earned: d.earned,
        earnedDiff: +(d.earned - avgEarn).toFixed(2),
        net: d.net,
        netDiff: +(d.net - avgNet).toFixed(2),
      };
      return acc;
    }, {} as Record<string, any>);

    setReport(rep);
    setAverages({ avgTotal, avgPaid, avgEarn, avgNet });
  }, [stats]);

  // Пока не смонтировано → ничего не показываем
  if (!report || !averages) return null;

  const { avgTotal, avgPaid, avgEarn, avgNet } = averages;

  return (
    <section className="max-w-[1200px] mx-auto mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(report).map(([day, d]) => (
          <div
            key={day}
            className="rounded-2xl p-5 shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="font-bold text-lg text-gray-800 mb-3 capitalize">
              {day}
            </h2>

            <StatRow
              icon={<CreditCard className="w-5 h-5 text-blue-500" />}
              label="Транзакций"
              value={d.total}
              diff={d.totalDiff}
            />

            <StatRow
              icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
              label="Успешных"
              value={d.paid}
              diff={d.paidDiff}
            />

            <StatRow
              icon={<CircleDollarSign className="w-5 h-5 text-amber-500" />}
              label="Заработано"
              value={`${d.earned.toLocaleString("ru-RU")} ₽`}
              diff={`${d.earnedDiff > 0 ? "+" : ""}${d.earnedDiff} ₽`}
              diffNum={d.earnedDiff}
            />

            <StatRow
              icon={<Wallet className="w-5 h-5 text-purple-500" />}
              label="Чистыми"
              value={`${d.net.toLocaleString("ru-RU")} ₽`}
              diff={`${d.netDiff > 0 ? "+" : ""}${d.netDiff} ₽`}
              diffNum={d.netDiff}
            />
          </div>
        ))}
      </div>

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
          <span className="font-semibold text-gray-900">
            Чистыми {avgNet.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
    </section>
  );
}

function StatRow({
  icon,
  label,
  value,
  diff,
  diffNum,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  diff: any;
  diffNum?: number;
}) {
  const num = diffNum ?? parseFloat(diff);
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-base font-semibold text-gray-900">{value}</span>{" "}
        <span
          className={`text-sm font-semibold ${
            num > 0
              ? "text-green-600"
              : num < 0
              ? "text-red-600"
              : "text-gray-400"
          }`}
        >
          {diff}
        </span>
      </div>
    </div>
  );
}
