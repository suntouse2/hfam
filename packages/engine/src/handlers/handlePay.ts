import { providers } from '@/providers'
import { connectorService } from '@/services/connectorsService'
import { domainsService } from '@/services/domainsService'
import { paymentsService } from '@/services/paymentsService'
import { projectsService } from '@/services/projectService'
import type { ConnectorDTO } from '@hfam/shared/dto/index'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { payCreateSchema } from '@hfam/shared/validation/pay'
import { paymentCreateSchema } from '@hfam/shared/validation/payments'
import type z from 'zod'

type PayPayload = z.infer<typeof payCreateSchema>

export const handlePay = async (payPayload: PayPayload) => {
	const { amount, projectId, payload, byProvider, method, connectorId, domain } =
		payPayload

	let connector: ConnectorDTO
	if (connectorId !== undefined)
		connector = await connectorService.getConnector(connectorId)
	else connector = await connectorService.balancer({ projectId, byProvider, method })

	if (!connector.active) throw ErrorAPI.badRequest('connector is not active')

	const domains = await domainsService.getDomains({ projectId })
	if (!domains.some(m => m.value == domain)) throw ErrorAPI.badRequest('invalid domain')

	const pInstance = providers.useInstance(connector.byProvider)

	const payment = await paymentsService.createPayment(
		paymentCreateSchema.parse({ ...payPayload, connector })
	)
	const updates = await pInstance.create({ connector, amount, payload })
	const updated = paymentsService.updatePayment(payment.id, updates)
	return updated
}
