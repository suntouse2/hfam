import z from "zod";
import PaymentSupport from "@/components/PaymentSupport";
import PaymentTRC from "@/components/PaymentTRC";
import { paramsSchema } from "@/z/z";
import { projectsApi } from "../../../../api/projectsApi";

export default async function SBP({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const { amount, projectId } = paramsSchema.parse(searchParams);

	const { wallet } = z.object({ wallet: z.string() }).parse(searchParams);

	const project = await projectsApi.getProject(projectId);

	return (
		<main className="mx-auto w-full max-w-[336px] py-6">
			<PaymentTRC amount={amount} wallet={wallet} />
			<PaymentSupport tgSupportId={project.tgSupportId} />
		</main>
	);
}
