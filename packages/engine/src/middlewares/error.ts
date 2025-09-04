import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ErrorAPI } from '@hfam/shared/helpers/error'

export function error(err: unknown, _req: Request, res: Response, _next: NextFunction) {
	if (err instanceof ErrorAPI) {
		return res.status(err.status).json({ error: err.message })
	}
	if (err instanceof ZodError) {
		console.log(err.issues)
		return res.status(400).json({ error: 'validation error' })
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		return res.status(400).json({ error: 'Invalid database request' })
	}
	console.log(err)

	return res.status(500).json({ error: 'Invalid request' })
}
