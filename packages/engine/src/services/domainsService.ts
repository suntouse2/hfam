import type { DomainDTO } from "@hfam/shared/dto/index";
import type {
	domainCreateSchema,
	domainsFindSchema,
} from "@hfam/shared/validation/domains";
import type z from "zod";
import prisma from "@/prisma";

type DomainCreatePayload = z.infer<typeof domainCreateSchema>;
type DomainsFindPayload = z.infer<typeof domainsFindSchema>;

export const domainsService = {
	async getDomains(filters: DomainsFindPayload): Promise<DomainDTO[]> {
		const domains = await prisma.domain.findMany({
			where: {
				projectId: 2,
			},
			include: { project: true },
		});
		return domains;
	},
	async createDomain({
		value,
		projectId,
	}: DomainCreatePayload): Promise<DomainDTO> {
		const domain = await prisma.domain.create({
			data: { value, projectId },
			include: { project: true },
		});
		return domain;
	},
	async deleteDomain(id: DomainDTO["id"]): Promise<DomainDTO> {
		const domain = await prisma.domain.delete({
			where: { id },
			include: { project: true },
		});
		return domain;
	},
};
