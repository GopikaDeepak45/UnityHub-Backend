import { CustomError } from "../utils/CustomError";

export class NotFoundError extends CustomError{
    StatusCode: number=404;
    constructor(){
        super('Resource not found')
        Object.setPrototypeOf(this,NotFoundError.prototype);
    }
    serialize(): { message: string; } {
        return{message:'Resource not found'}
    }
}