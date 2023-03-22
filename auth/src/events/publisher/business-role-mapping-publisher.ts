import { Subjects,Publisher,BBusinessRoleMappingCreatedEvent } from "@rx-marketplace/common";

export class BusinessRoleMappingCreatedPublisher extends Publisher<BBusinessRoleMappingCreatedEvent>{
    subject: Subjects.BusinessRoleMappingCreated=Subjects.BusinessRoleMappingCreated;
}