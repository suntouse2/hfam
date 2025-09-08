import prisma from "../prisma.js";
export const methodsService = {
    async getMethods (filters) {
        const methods = await prisma.method.findMany({
            where: filters,
            include: {
                project: true,
                connector: true
            }
        });
        return methods;
    },
    async getMethod (id) {
        const method = await prisma.method.findUnique({
            where: {
                id
            },
            include: {
                project: true,
                connector: true
            }
        });
        return method;
    },
    async createMethod (payload) {
        const method = await prisma.method.create({
            data: payload,
            include: {
                project: true,
                connector: true
            }
        });
        return method;
    },
    // prettier-ignore
    async updateMethod (id, payload) {
        const method = await prisma.method.update({
            where: {
                id
            },
            include: {
                project: true,
                connector: true
            },
            data: {
                label: payload.label,
                imageSrc: payload.imageSrc,
                byProvider: payload.byProvider,
                connectorId: payload.connectorId,
                active: payload.active,
                minAmount: payload.minAmount,
                maxAmount: payload.maxAmount,
                method: payload.method,
                showLabel: payload.showLabel
            }
        });
        return method;
    },
    async deleteMethod (id) {
        const method = await prisma.method.delete({
            where: {
                id
            },
            include: {
                project: true,
                connector: true
            }
        });
        return method;
    }
};
