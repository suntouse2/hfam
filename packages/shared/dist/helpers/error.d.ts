export declare class ErrorAPI extends Error {
    status: number;
    constructor(status: number, message: string);
    static badRequest(msg: string): ErrorAPI;
    static unauthorized(msg?: string): ErrorAPI;
    static forbidden(msg?: string): ErrorAPI;
    static notFound(msg?: string): ErrorAPI;
    static internal(msg?: string): ErrorAPI;
}
//# sourceMappingURL=error.d.ts.map