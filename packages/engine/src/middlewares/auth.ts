import { ErrorAPI } from "@hfam/shared/helpers/error";
import type { NextFunction, Request, Response } from "express";

export function auth(req: Request, _res: Response, next: NextFunction) {
	// biome-ignore lint/complexity/useLiteralKeys: :>
	const header = req.headers["authorization"];

	if (!header) {
		return next(ErrorAPI.unauthorized("Unauthorized: no token"));
	}

	const [scheme, token] = header.split(" ");

	if (scheme !== "Bearer" || !token) {
		return next(ErrorAPI.unauthorized("Unauthorized: bad format"));
	}

	if (!process.env.API_KEY) {
		throw new Error("API_KEY not configured");
	}

	if (token !== process.env.API_KEY) {
		return next(ErrorAPI.forbidden("Forbidden: invalid token"));
	}

	return next();
}
