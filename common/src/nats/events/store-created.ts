import { Subjects } from "../enums/subjects";
export interface StoreCreatedEvent{
    subject:Subjects.StoreCreated,
    data:{
        id:string,
        phoneNumber: number;
        email: string;
        businessProfileId: string,
        businessSubCategoryId: string,
        description: string,
        name: string,
        membershipId?: string,
        createdBy: string,
        isActive:boolean,
    }
}