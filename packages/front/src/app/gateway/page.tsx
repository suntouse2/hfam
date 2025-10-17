"use server";

import PaymentForm from "@/components/PaymentForm";
import PaymentHeader from "@/components/PaymentHeader";
import PaymentSupport from "@/components/PaymentSupport";
import { paramsSchema } from "@/z/z";
import { methodsApi } from "../../../api/methodsApi";
import { projectsApi } from "../../../api/projectsApi";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const sp = await searchParams;
	const { amount, description, domain, orderId, projectId } =
		paramsSchema.parse(sp);

	const methods = await methodsApi.getMethods({
		projectId: projectId,
		minAmount: amount,
		maxAmount: amount,
	});
	const project = await projectsApi.getProject(projectId);

	return (
		<main className="mx-auto w-full max-w-[336px] py-6">
			<PaymentHeader
				amount={amount}
				description={description}
				domain={domain}
			/>
			<PaymentForm
				projectId={projectId}
				orderId={orderId}
				amount={amount}
				description={description}
				domain={domain}
				methods={methods}
			/>
			<PaymentSupport tgSupportId={project.tgSupportId} />
		</main>
	);
}
