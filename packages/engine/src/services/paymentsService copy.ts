import prisma from '@/prisma'
import { defuse } from '@/utils/helpers'
import type { Payment, Project, Provider } from '@prisma/client'

export interface CreatePaymentType {
	projectId: Project['id']
	providerId: Provider['id']
	amount: Payment['amount']
	paymentId?: Payment['paymentId']
	paymentUrl?: Payment['paymentUrl']
	paymentQr?: Payment['paymentQr']
	method?: Payment['method']
}
export interface UpdatePaymentType {
	status?: Payment['status']
	paymentId?: Payment['paymentId']
	paymentUrl?: Payment['paymentUrl']
	paymentQr?: Payment['paymentQr']
	method?: Payment['method']
}

export interface PaymentStatsFilters {
	projectId?: number
	providerId?: number
}
export interface Period {
	from?: Date
	to?: Date
}
export const paymentsService = {
	async createPayment(payload: CreatePaymentType) {
		const payment = await prisma.payment.create({
			data: { ...payload },
		})
		return payment
	},
	async findPayment(filters: { paymentId?: string }) {
		const payment = await prisma.payment.findFirstOrThrow({
			where: filters,
		})
		return payment
	},
	async updatePayment(paymentId: Payment['id'], payload: UpdatePaymentType) {
		const payment = await prisma.payment.update({
			where: { id: paymentId },
			data: { ...payload },
		})
		return payment
	},
	async getPaymentsStats(filters: PaymentStatsFilters, period?: Period) {
		const where = defuse({
			...filters,
			updatedAt: period ? defuse({ gte: period.from, lte: period.to }) : undefined,
		})

		const agg = await prisma.payment.aggregate({
			where: { ...where, status: 'PAID' },
			_sum: { amount: true },
			_count: { amount: true },
		})

		return {
			sum: agg._sum.amount ?? 0,
			count: agg._count.amount,
		}
	},
}
