import { ErrorAPI } from "@hfam/shared/helpers/error";
import { gfs } from "@hfam/shared/utils/gfs";
import type { NextFunction, Request, Response } from "express";
import { HTTPError } from "got";
import { ZodError } from "zod";

export function error(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof ErrorAPI) {
		return res.status(err.status).json({ error: err.message });
	}
	if (err instanceof ZodError) {
		console.log(err.issues);
		const stack = gfs(err);
		console.log(stack?.join("\n") ?? err.stack);

		return res.status(400).json({
			error: "validation error",
		});
	}

	if (err instanceof HTTPError) {
		console.log(JSON.parse(err.response?.body));

		return res.status(400).json({ error: "got request error" });
	}
	console.log(err);

	return res.status(500).json({ error: "Invalid request" });
}
