import { Subjects,Publisher,BusinessRoleTypeCreatedEvent } from "@rx-marketplace/common";

export class BusinessRoleTypeCreatedPublisher extends Publisher<BusinessRoleTypeCreatedEvent>{
    subject: Subjects.BusinessRoleTypeCreated=Subjects.BusinessRoleTypeCreated;
}