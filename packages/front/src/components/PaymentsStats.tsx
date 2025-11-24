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

// ---- ВРЕМЯ ПО МОСКВЕ ----
function toMSK(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
}

function startOfMSKDay(date: Date): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // "2025-11-24"
  const [y, m, d] = fmt.format(date).split("-");
  return new Date(`${y}-${m}-${d}T00:00:00+03:00`);
}
// --------------------------

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
    const todayStart = startOfMSKDay(nowMSK);

    const days = Array.from({ length: 7 }).map((_, i) => {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const dayPayments = data.filter((p) => {
        const dt = toMSK(p.createdAt);
        return dt >= start && dt < end;
      });

      const paid = dayPayments.filter((p) => p.status === "PAID");
      const earned = paid.reduce((acc, p) => acc + p.amount, 0);
      const net = +(earned * 0.925).toFixed(2);

      const weekday = start.toLocaleDateString("ru-RU", {
        weekday: "long",
        timeZone: "Europe/Moscow",
      });

      const label =
        i === 0
          ? `Сегодня, ${weekday}`
          : i === 1
          ? `Вчера, ${weekday}`
          : `${start.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              timeZone: "Europe/Moscow",
            })} ${weekday}`;

      return {
        label,
        total: dayPayments.length,
        paid: paid.length,
        earned,
        net,
      };
    });

    const avg = (key: keyof (typeof days)[number]) =>
      +(
        days.reduce((acc, d) => acc + (d[key] as number), 0) / days.length
      ).toFixed(2);

    const averages = {
      avgTotal: avg("total"),
      avgPaid: avg("paid"),
      avgEarn: avg("earned"),
      avgNet: avg("net"),
    };

    const rep = days.reduce((acc, d) => {
      acc[d.label] = {
        total: d.total,
        totalDiff: +(d.total - averages.avgTotal).toFixed(2),
        paid: d.paid,
        paidDiff: +(d.paid - averages.avgPaid).toFixed(2),
        earned: d.earned,
        earnedDiff: +(d.earned - averages.avgEarn).toFixed(2),
        net: d.net,
        netDiff: +(d.net - averages.avgNet).toFixed(2),
      };
      return acc;
    }, {} as Record<string, any>);

    setReport(rep);
    setAverages(averages);
  }, [stats]);

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
    </section>
  );
}

function StatRow({ icon, label, value, diff, diffNum }: any) {
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
