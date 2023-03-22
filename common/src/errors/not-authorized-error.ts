import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    constructor() {
        super('Not authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    statusCode: number = 401;
    serializeErrors() {
        return [{
            success: false,
            page: 0,
            total: 0,
            message: this.message,
            data: 'Not Found',
        }]
    }

}