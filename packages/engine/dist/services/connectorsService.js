import prisma from "../prisma.js";
import { providers } from "../providers/index.js";
import { ErrorAPI } from "@hfam/shared/helpers/error";
export const connectorService = {
    async getConnectors (filters) {
        const connectors = await prisma.connector.findMany({
            where: filters,
            include: {
                project: true
            }
        });
        return connectors;
    },
    async getConnector (id) {
        const connector = await prisma.connector.findUniqueOrThrow({
            where: {
                id
            },
            include: {
                project: true
            }
        });
        return connector;
    },
    async createConnector (data) {
        const provider = providers.getProvider(data.byProvider);
        const connector = await prisma.connector.create({
            data: {
                name: data.name,
                byProvider: data.byProvider,
                projectId: data.projectId,
                schema: provider.schema
            },
            include: {
                project: true
            }
        });
        return connector;
    },
    async updateConnector (id, data) {
        const connector = await prisma.connector.update({
            where: {
                id
            },
            data,
            include: {
                project: true
            }
        });
        return connector;
    },
    async deleteConnector (id) {
        const connector = await prisma.connector.delete({
            where: {
                id
            },
            include: {
                project: true
            }
        });
        return connector;
    },
    async balancer (filters) {
        const connectors = await prisma.connector.findMany({
            where: {
                byProvider: filters.byProvider ?? undefined,
                projectId: filters.projectId,
                methods: {
                    some: {
                        method: filters.method
                    }
                },
                active: true
            },
            orderBy: {
                bIndex: 'asc'
            },
            include: {
                project: true
            }
        });
        const filtered = connectors.filter((c)=>{
            const provider = providers.getProvider(c.byProvider);
            if (!provider.active) return false;
            return filters.method ? provider.methods.includes(filters.method) : true;
        });
        if (!filtered.length) throw ErrorAPI.badRequest('No available balanced connectors by this params');
        const connector = filtered[0];
        await prisma.connector.update({
            where: {
                id: connector.id
            },
            data: {
                bIndex: {
                    increment: 1
                }
            }
        });
        return connector;
    }
};
