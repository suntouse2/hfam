import { providers } from '@/providers'
import { connectorService } from '@/services/connectorsService'
import { paymentsService } from '@/services/paymentsService'
import type { ConnectorDTO } from '@hfam/shared/dto/index'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { payCreateSchema } from '@hfam/shared/validation/pay'
import { paymentCreateSchema } from '@hfam/shared/validation/payments'
import type z from 'zod'

type PayPayload = z.infer<typeof payCreateSchema>

export const handlePay = async (payPayload: PayPayload) => {
	const { amount, projectId, payload, byProvider, method, connectorId } = payPayload

	let connector: ConnectorDTO
	if (connectorId) connector = await connectorService.getConnector(connectorId)
	else connector = await connectorService.balancer({ projectId, byProvider, method })

	const pInstance = providers.useInstance(connector.byProvider)

	const payment = await paymentsService.createPayment(
		paymentCreateSchema.parse({
			...payPayload,
			connector,
		})
	)
	const updates = await pInstance.create({
		connector,
		amount,
		payload,
	})
	const updated = paymentsService.updatePayment(payment.id, updates)
	return updated
}
