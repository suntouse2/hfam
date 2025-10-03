import Image from "next/image";

type PaymentHeaderProps = {
	amount: number;
	description: string;
	domain: string;
};
// prettier-ignore
export default function PaymentHeader({
	amount,
	description,
	domain,
}: PaymentHeaderProps) {
	const sum = amount.toLocaleString("ru-RU");

	return (
		<div className="rounded-3xl bg-white p-6 mb-4">
			<button
				type="button"
				className="flex items-center gap-2 font-semibold text-lg"
			>
				<span>{sum} ₽</span>
				<Image
					alt="down"
					width={16}
					height={16}
					src="/down.svg"
					className="w-4 h-4 opacity-50 transition-transform"
				/>
			</button>

			<div className="mt-2">
				<div className="flex flex-col gap-1 text-sm">
					<div className="flex justify-between">
						<span className="font-medium">Магазин</span>
						<a href={`https://${domain}`} className="text-blue-500">
							{domain}
						</a>
					</div>
					{description && (
						<div className="flex justify-between">
							<span className="font-medium">Описание</span>
							<span>{description}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
