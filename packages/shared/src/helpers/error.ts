export class ErrorAPI extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		Object.setPrototypeOf(this, ErrorAPI.prototype);
	}

	static badRequest(msg: string) {
		return new ErrorAPI(400, msg);
	}

	static unauthorized(msg = "Unauthorized") {
		return new ErrorAPI(401, msg);
	}

	static forbidden(msg = "Forbidden") {
		return new ErrorAPI(403, msg);
	}

	static notFound(msg = "Not Found") {
		return new ErrorAPI(404, msg);
	}

	static internal(msg = "Internal Server Error") {
		return new ErrorAPI(500, msg);
	}
}
