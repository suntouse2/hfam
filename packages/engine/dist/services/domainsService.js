import prisma from "../prisma.js";
export const domainsService = {
    async getDomains (filters) {
        const domains = await prisma.domain.findMany({
            where: filters,
            include: {
                project: true
            }
        });
        return domains;
    },
    async createDomain ({ value, projectId }) {
        const domain = await prisma.domain.create({
            data: {
                value,
                projectId
            },
            include: {
                project: true
            }
        });
        return domain;
    },
    async deleteDomain (id) {
        const domain = await prisma.domain.delete({
            where: {
                id
            },
            include: {
                project: true
            }
        });
        return domain;
    }
};
