import z from "zod";
import PaymentP2P from "@/components/PaymentP2P";
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

	const { digits, bank, owner } = z
		.object({
			digits: z.string(),
			bank: z.string(),
			owner: z.string(),
		})
		.parse(searchParams);

	const project = await projectsApi.getProject(projectId);

	return (
		<main className="mx-auto w-full max-w-[336px] py-6">
			<PaymentP2P amount={amount} digits={digits} bank={bank} owner={owner} />
			<PaymentSupport tgSupportId={project.tgSupportId} />
		</main>
	);
}
