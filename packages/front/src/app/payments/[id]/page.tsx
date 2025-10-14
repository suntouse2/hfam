"use server";

import checkApi from "@/actions/checkApi";
import { paymentsApi } from "../../../../api/paymentsApi";
import { projectsApi } from "../../../../api/projectsApi";
import "../../tables.css";
import Payment from "@/components/Payment";

export default async function PaymentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await checkApi();
	const data = await params;
	const { id } = data;

	const projects = await projectsApi.getProjects();
	const payment = await paymentsApi.getPayment(id);

	const project = projects.filter((p) => p.id === payment.projectId)[0];

	if (!payment) {
		return (
			<section className="p-6">
				<h1 className="text-xl font-semibold text-red-500">Платёж не найден</h1>
			</section>
		);
	}

	return (
		<section className="text-sm p-4 overflow-hidden w-full max-w-[500px] py-5">
			<Payment payment={payment} paymentProject={project} />
		</section>
	);
}
