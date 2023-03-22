import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statusCode = 500;
    constructor() {
        super('Error connecting to DB');
        //only bacause we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
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