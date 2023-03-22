import { Subjects } from "../enums/subjects";
export interface AttributeUpdateEvent{
    subject:Subjects.AttributeUpdate,
    data:{
        id:string,
        name:string,
        type:string,
        isAcive:boolean,
    }
}