import { ErrorAPI } from "@hfam/shared/helpers/error";
export function auth(req, _res, next) {
    const header = req.headers['authorization'];
    if (!header) {
        return next(ErrorAPI.unauthorized('Unauthorized: no token'));
    }
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return next(ErrorAPI.unauthorized('Unauthorized: bad format'));
    }
    if (!process.env.SYSTEM_TOKEN) {
        throw new Error('SYSTEM_TOKEN not configured');
    }
    if (token !== process.env.SYSTEM_TOKEN) {
        return next(ErrorAPI.forbidden('Forbidden: invalid token'));
    }
    return next();
}
