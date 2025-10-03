import Image from "next/image";
import { CopyButton } from "@/ui/Copy";

export default function PaymentP2P({
	amount,
	digits,
	bank,
	owner,
}: {
	amount: number;
	digits: string;
	bank: string;
	owner: string;
}) {
	return (
		<>
			<div className="rounded-3xl bg-white p-6 mb-4">
				<p className="text-base font-semibold">Перевод по карте</p>
				<p className="text-xs text-gray-600 mt-2">
					Переведите <b>{amount.toLocaleString("ru-RU")} ₽</b> на указанные
					реквизиты
				</p>
				<div className="flex flex-col items-center justify-center gap-2 mt-4">
					<div className="relative loading w-8 h-8 border-2 border-gray-300 rounded-full animate-spin">
						<span className="absolute top-0 left-0 w-2 h-2 bg-white flex items-center justify-center"></span>
					</div>
					<p className="text-base font-semibold">Ожидаем перевода</p>
				</div>
			</div>

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

				<div className="mt-2">
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex justify-between items-center text-sm">
							<span className="font-medium">Номер</span>
							<div className="flex items-center gap-2">
								<b>{digits}</b>

								<CopyButton content={digits} />
							</div>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span className="font-medium">Владелец</span>
							<div className="flex items-center gap-2">
								<b>{owner}</b>

								<CopyButton content={owner} />
							</div>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span className="font-medium">Банк</span>
							<div className="flex items-center gap-2">
								<b>{bank}</b>

								<CopyButton content={bank} />
							</div>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span className="font-medium">Сумма</span>
							<div className="flex items-center gap-2">
								<b>{amount.toLocaleString("ru-RU")} ₽</b>

								<CopyButton content={amount.toString()} />
							</div>
						</div>
					</div>
				</div>

				<p className="text-xs font-medium text-gray-600 text-center mt-4">
					Делая «Перевод», вы соглашаетесь{" "}
					<a href="/terms" className="text-blue-500">
						с условиями
					</a>
				</p>
			</div>
		</>
	);
}
