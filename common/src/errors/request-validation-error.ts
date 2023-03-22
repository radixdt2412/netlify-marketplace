import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('Invalid login parameters');

        //only bacause we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {
                success: false,
                page: 0,
                total: 0,
                message:  err.msg,
                data: err.param
            }
        })
    }
}