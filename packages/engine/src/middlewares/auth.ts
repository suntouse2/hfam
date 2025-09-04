import { ErrorAPI } from '@hfam/shared/helpers/error'
import type { Request, Response, NextFunction } from 'express'

export function auth(req: Request, _res: Response, next: NextFunction) {
	const header = req.headers['authorization']

	if (!header) {
		return next(ErrorAPI.unauthorized('Unauthorized: no token'))
	}

	const [scheme, token] = header.split(' ')

	if (scheme !== 'Bearer' || !token) {
		return next(ErrorAPI.unauthorized('Unauthorized: bad format'))
	}

	if (token !== process.env.SYSTEM_TOKEN) {
		return next(ErrorAPI.forbidden('Forbidden: invalid token'))
	}

	return next()
}
