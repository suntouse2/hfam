import prisma from "../prisma.js";
export const paymentsService = {
    async createPayment (payload) {
        const payment = await prisma.payment.create({
            data: payload
        });
        return payment;
    },
    //prettier-ignore
    async updatePayment (id, payload) {
        const payment = await prisma.payment.update({
            where: {
                id
            },
            data: payload
        });
        return payment;
    },
    async getPayment (id) {
        const payment = await prisma.payment.findUnique({
            where: {
                id
            }
        });
        return payment;
    },
    async getPayments (filters, page = 1, limit = 20) {
        const { query, ...rest } = filters || {};
        const where = {
            ...rest,
            ...query ? {
                OR: [
                    {
                        paymentId: query
                    },
                    {
                        orderId: query
                    },
                    {
                        id: query
                    }
                ]
            } : {}
        };
        const [count, payments] = await Promise.all([
            prisma.payment.count({
                where
            }),
            prisma.payment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit
            })
        ]);
        return {
            data: payments,
            count,
            page,
            limit
        };
    }
};
