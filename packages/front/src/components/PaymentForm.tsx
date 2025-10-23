"use client";

import type { MethodDTO } from "@hfam/shared/dto/index";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PaymentForm({
  projectId,
  orderId,
  amount,
  description,
  domain,
  methods,
}: {
  projectId: number;
  orderId: string;
  amount: number;
  description: string;
  domain: string;
  methods: MethodDTO[];
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / 60000) * 100, 100); // 60s
      setProgress(percent);
      if (percent >= 100) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [loading]);

  async function handlePay(methodId: number) {
    try {
      setLoading(String(methodId));
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          orderId,
          amount,
          description,
          domain,
          methodId,
        }),
      });
      if (!res.ok) throw new Error("payment failed");
      const data = await res.json();
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error(err);
      alert("Ошибка при оплате");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      className={`relative ${loading && "pointer-events-none"} overflow-hidden rounded-3xl bg-white p-6 mb-4`}
    >
      {loading && (
        <div className="pointer-events-none absolute left-0 top-0 w-full h-full z-20 bg-white flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="animate-spin" />
            <p className="font-semibold">Подождите</p>
            <p className="text-xs mb-2">Идет переход к оплате</p>
            <div className="w-40 h-[2px] bg-gray-300 overflow-hidden rounded">
              <div
                className="h-full bg-black transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <p className="text-base font-semibold">Быстрая оплата</p>

      <div className="flex flex-col gap-2 mt-4 mb-3">
        {methods.map((method) => (
          <button
            type="button"
            key={method.id}
            onClick={(e) => {
              e.preventDefault();
              handlePay(method.id);
            }}
            disabled={loading === String(method.id)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 h-10 font-medium hover:opacity-70 disabled:opacity-50 text-sm"
          >
            {method.imageSrc && (
              <Image
                width={20}
                height={20}
                src={method.imageSrc}
                alt="method icon"
                className="w-5 h-5 object-contain"
              />
            )}
            {method.showLabel && <span>{method.label}</span>}
          </button>
        ))}
      </div>

      <p className="text-[12px] font-sans font-medium text-gray-600 text-center">
        Нажимая «Оплатить», вы соглашаетесь{" "}
        <a href="/terms" className="text-blue-500">
          с условиями сайта
        </a>
      </p>
    </div>
  );
}
