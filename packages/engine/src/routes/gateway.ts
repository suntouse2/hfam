import { domainsService } from '@/services/domainsService'
import { projectsService } from '@/services/projectService'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import { gatewayGetParams } from '@hfam/shared/validation/gateway'
import { Router } from 'express'
import z from 'zod'

export const gateway = Router()

gateway.get('/:id', async (req, res) => {
	const gateway = gatewayGetParams.parse(req.query)
	const id = z.coerce.number().nonnegative().parse(req.params.id)
	const project = await projectsService.getProject(id)
	const domains = await domainsService.getDomains({ projectId: project.id })

	if (!domains.some(m => m.value == gateway.domain))
		throw ErrorAPI.badRequest('invalid domain')

	res.render('pay', { project, gateway })
})
