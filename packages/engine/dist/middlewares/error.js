import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ErrorAPI } from "@hfam/shared/helpers/error";
import { HTTPError } from "got";
import { gfs } from "@hfam/shared/utils/gfs";
export function error(err, _req, res, _next) {
    if (err instanceof ErrorAPI) {
        return res.status(err.status).json({
            error: err.message
        });
    }
    if (err instanceof ZodError) {
        console.log(err.issues);
        const stack = gfs(err);
        console.log(stack?.join('\n') ?? err.stack);
        return res.status(400).json({
            error: 'validation error'
        });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err);
        return res.status(400).json({
            error: 'Invalid database request'
        });
    }
    if (err instanceof HTTPError) {
        console.log(JSON.parse(err.response?.body));
        return res.status(400).json({
            error: 'got request error'
        });
    }
    console.log(err);
    return res.status(500).json({
        error: 'Invalid request'
    });
}
