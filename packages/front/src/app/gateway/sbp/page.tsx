import z from "zod";
import PaymentSbp from "@/components/PaymentSbp";
import PaymentSupport from "@/components/PaymentSupport";
import { paramsSchema } from "@/z/z";
import { projectsApi } from "../../../../api/projectsApi";

export default async function SBP({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const { amount, projectId } = paramsSchema.parse(searchParams);

	const { number, owner, bank } = z
		.object({
			number: z.string(),
			owner: z.string(),
			bank: z.string(),
		})
		.parse(searchParams);

	const project = await projectsApi.getProject(projectId);

	return (
		<main className="mx-auto w-full max-w-[336px] py-6">
			<PaymentSbp amount={amount} number={number} owner={owner} bank={bank} />
			<PaymentSupport tgSupportId={project.tgSupportId} />
		</main>
	);
}
