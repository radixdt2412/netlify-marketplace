import { Subjects } from "../enums/subjects";
export interface AttributeValueUpdateEvent{
    subject:Subjects.AttributeValueUpdate,
    data:{
        id:string,
        value: string,
        attributeId: string,
        isAcive:boolean,
    }
}