import Image from "next/image";

export default function PaymentSupport({
	tgSupportId,
}: {
	tgSupportId: string;
}) {
	return (
		<>
			<div className="flex gap-1 justify-center items-center text-xs text-gray-600 mb-16">
				Не получилось оплатить?{" "}
				<a href={`https://t.me/${tgSupportId}`} className="text-blue-500">
					Свяжитесь с нами
				</a>
			</div>

			<div className="fixed bottom-2 right-2 flex gap-2">
				<a
					className="flex items-center gap-2"
					href={`https://t.me/${tgSupportId}`}
				>
					<Image
						alt="telegram"
						width={48}
						height={48}
						className="w-12 h-12 rounded-full"
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1024px-Telegram_2019_Logo.svg.png"
					/>
					<Image
						alt="support"
						width={48}
						height={48}
						className="w-12 h-12 rounded-full"
						src="https://www.svgrepo.com/show/192522/customer-service-support.svg"
					/>
				</a>
			</div>
		</>
	);
}
