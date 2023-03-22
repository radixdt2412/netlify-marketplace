export abstract class CustomError  extends Error{
    abstract statusCode : number
    constructor(message : string){
        super(message);
        Object.setPrototypeOf(this , CustomError.prototype)
    }
    abstract serializeErrors() : {success: boolean,page: number, total: number,message: string ,data: string,}[];
    
}
