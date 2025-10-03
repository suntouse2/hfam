"use client";

import Image from "next/image";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";
import { CopyButton } from "@/ui/Copy";

export default function PaymentTRC({
	amount,
	wallet,
}: {
	amount: number;
	wallet: string;
}) {
	const qrValue = `trc20:${wallet}?amount=${amount}`;
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const qr = new QRCodeStyling({
			width: 220,
			height: 220,
			type: "svg",
			data: qrValue,
			image: "/trc.png",
			dotsOptions: {
				color: "#26A17B",
				type: "rounded",
			},
			backgroundOptions: {
				color: "#fff",
			},
			imageOptions: {
				crossOrigin: "anonymous",
				margin: 0,
			},
		});

		if (ref.current) {
			qr.append(ref.current);
		}
	}, [qrValue]);
	return (
		<>
			{/* Верхний блок */}
			<div className="rounded-3xl bg-white p-6 mb-4">
				<p className="text-base font-semibold">Перевод USDT TRC-20</p>
				<p className="text-xs text-gray-600 mt-2">
					Переведите <b>{amount.toLocaleString("ru-RU")} ₽</b> на указанный
					кошелек
				</p>
				<div className="flex flex-col items-center justify-center gap-2 mt-4">
					<div className="relative loading w-8 h-8 border-2 border-gray-300 rounded-full animate-spin">
						<span className="absolute top-0 left-0 w-2 h-2 bg-white flex items-center justify-center"></span>
					</div>
					<p className="text-base font-semibold">Ожидаем перевода</p>
				</div>
			</div>

			{/* Блок реквизитов */}
			<div className="rounded-3xl bg-white p-6 mb-4">
				<button
					type="button"
					className="flex items-center justify-between w-full text-base font-semibold"
				>
					<p>Реквизиты</p>
					<Image
						alt="down"
						width={16}
						height={16}
						src="/down.svg"
						className="w-4 h-4 opacity-50 transition-transform"
					/>
				</button>

				<div className="mt-4 flex flex-col items-center gap-6">
					<div ref={ref} />

					<div className="flex w-full justify-between items-center text-sm">
						<span className="font-medium">Сумма </span>
						<div className="flex items-center gap-2">
							<b>{amount.toLocaleString("ru-RU")} ₽</b>
							<CopyButton content={amount.toString().replace(/\s+/g, "")} />
						</div>
					</div>
					<div className="w-full">
						<p className="flex items-center justify-between text-sm font-medium mb-2">
							Кошелек TRC-20 <CopyButton content={wallet} />
						</p>
						<div className="break-all text-[11px] bg-gray-100 p-3 rounded-xl font-mono">
							{wallet}
						</div>
					</div>
				</div>

				<p className="text-xs font-medium text-gray-600 text-center mt-6">
					Делая «Перевод», вы соглашаетесь{" "}
					<a href="/terms" className="text-blue-500">
						с условиями
					</a>
				</p>
			</div>
		</>
	);
}
