"use server";

import z from "zod";
import PaymentP2P from "@/components/PaymentP2P";
import PaymentSupport from "@/components/PaymentSupport";
import { paramsSchema } from "@/z/z";
import { projectsApi } from "../../../../api/projectsApi";

export default async function SBP({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const sp = await searchParams;
	const { amount, projectId } = paramsSchema.parse(sp);

	const { digits, bank, owner } = z
		.object({
			digits: z.string(),
			bank: z.string(),
			owner: z.string(),
		})
		.parse(sp);

	const project = await projectsApi.getProject(projectId);

	return (
		<main className="mx-auto w-full max-w-[336px] py-6">
			<PaymentP2P amount={amount} digits={digits} bank={bank} owner={owner} />
			<PaymentSupport supportLink={project.supportLink} />
		</main>
	);
}
