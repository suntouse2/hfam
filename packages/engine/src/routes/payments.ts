import { projectsService } from '@/services/projectService'
import { Router } from 'express'

export const payments = Router()

payments.get('/', async (req, res) => {
	const projects = await projectsService.getProjects()
	res.json(projects)
})
