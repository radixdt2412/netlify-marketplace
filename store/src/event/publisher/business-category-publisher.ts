import { Subjects,Publisher,BusinessCategoryCreatedEvent } from "@rx-marketplace/common"

export class BusinessCategoryCreatedPublisher extends Publisher<BusinessCategoryCreatedEvent>{
    subject: Subjects.BusinessCategoryCreated=Subjects.BusinessCategoryCreated;
}