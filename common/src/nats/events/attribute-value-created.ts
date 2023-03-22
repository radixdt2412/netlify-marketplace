import { Subjects } from "../enums/subjects";
export interface AttributeValueCreatedEvent{
    subject:Subjects.AttributeValueCreated,
    data:{
        id:string,
        value: string,
        attributeId: string,
        isAcive:boolean,
    }
}