import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    statusCode: number = 404;
    serializeErrors() {
        return [{
            success: false,
            page: 0,
            total: 0,
            message: "Route not found",
            data: 'Not Found',
        }];
    }

}