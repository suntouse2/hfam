"use client";

import {
  BarChart3,
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

  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const week = data.filter((p) => p.createdAt >= startOfWeek);
  const today = data.filter((p) => p.createdAt >= startOfToday);
  const yesterday = data.filter(
    (p) => p.createdAt >= startOfYesterday && p.createdAt < startOfToday
  );

  const weekPaid = week.filter((p) => p.status === "PAID");
  const todayPaid = today.filter((p) => p.status === "PAID");
  const yesterdayPaid = yesterday.filter((p) => p.status === "PAID");

  const countWeek = week.length;
  const countWeekPaid = weekPaid.length;
  const countToday = today.length;
  const countTodayPaid = todayPaid.length;
  const countYesterday = yesterday.length;
  const countYesterdayPaid = yesterdayPaid.length;

  const avgPerDay = +(countWeek / 7).toFixed(2);
  const avgPaidPerDay = +(countWeekPaid / 7).toFixed(2);

  const diffTodayPercent = avgPerDay
    ? +(((countToday - avgPerDay) / avgPerDay) * 100).toFixed(1)
    : 0;

  const diffTodayPaidPercent = avgPaidPerDay
    ? +(((countTodayPaid - avgPaidPerDay) / avgPaidPerDay) * 100).toFixed(1)
    : 0;

  // заработок
  const sum = (arr: PaymentDTO[]) => arr.reduce((acc, p) => acc + p.amount, 0);
  const earnWeek = sum(weekPaid);
  const earnToday = sum(todayPaid);
  const avgEarnPerDay = +(earnWeek / 7).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <Stat
        icon={BarChart3}
        label="Транзакции за неделю"
        value={countWeek}
        sub={`Среднее в день: ${avgPerDay}`}
      />
      <Stat
        icon={CheckCircle2}
        label="Успешные за неделю"
        value={countWeekPaid}
        sub={`Среднее в день: ${avgPaidPerDay}`}
      />
      <Stat
        icon={CreditCard}
        label="Сегодня"
        value={countToday}
        sub={`${
          diffTodayPercent > 0 ? "+" : ""
        }${diffTodayPercent}% к среднему`}
        trend={diffTodayPercent}
      />
      <Stat
        icon={CheckCircle2}
        label="Успешные сегодня"
        value={countTodayPaid}
        sub={`${
          diffTodayPaidPercent > 0 ? "+" : ""
        }${diffTodayPaidPercent}% к среднему`}
        trend={diffTodayPaidPercent}
      />
      <Stat
        icon={CreditCard}
        label="Вчера"
        value={countYesterday}
        sub={`Успешных: ${countYesterdayPaid}`}
      />
      <Stat
        icon={DollarSign}
        label="Заработок за неделю"
        value={earnWeek.toLocaleString("ru-RU")}
        sub={`Средний в день: ${avgEarnPerDay.toLocaleString("ru-RU")}`}
      />
      <Stat
        icon={DollarSign}
        label="Заработок сегодня"
        value={earnToday.toLocaleString("ru-RU")}
        trend={earnToday >= avgEarnPerDay ? 1 : -1}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  trend?: number;
}) {
  const isUp = trend && trend > 0;
  const isDown = trend && trend < 0;
  return (
    <div className="bg-gray  border !text-black border-black/10 rounded-2xl p-4 flex flex-col justify-between ">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-blue-400" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-semibold ">{value}</div>
      {sub && <div className="text-xs  mt-1">{sub}</div>}
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 mt-2 text-xs ${
            isUp ? "text-green-400" : isDown ? "text-red-400" : "text-black"
          }`}
        >
          {isUp && <TrendingUp size={12} />}
          {isDown && <TrendingDown size={12} />}
          {isUp ? "Рост" : isDown ? "Падение" : "Без изменений"}
        </div>
      )}
    </div>
  );
}
