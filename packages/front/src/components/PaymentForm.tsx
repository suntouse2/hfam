"use client";

import type { MethodDTO } from "@hfam/shared/dto/index";
import Image from "next/image";
import { useState } from "react";

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
			className={`rounded-3xl bg-white p-6 mb-4 ${loading && "opacity-50 pointer-events-none"}`}
		>
			<p className="text-base font-semibold">Быстрая оплата</p>

			<div className={`flex flex-col gap-2 mt-4 mb-3`}>
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

			<p className="!text-[12px] font-sans font-medium text-gray-600 text-center">
				Нажимая «Оплатить», вы соглашаетесь{" "}
				<a href="/terms" className="text-blue-500">
					с условиями сайта
				</a>
			</p>
		</div>
	);
}
