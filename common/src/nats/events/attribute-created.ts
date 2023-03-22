import { Subjects } from "../enums/subjects";
export interface AttributeCreatedEvent{
    subject:Subjects.AttributeCreated,
    data:{
        id:string,
        name:string,
        type:string,
        isAcive:boolean,
    }
}