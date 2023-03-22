import { Subjects,Publisher,BusinessSubCategoryCreatedEvent } from "@rx-marketplace/common"

export class BusinessSubCategoryCreatedPublisher extends Publisher<BusinessSubCategoryCreatedEvent>{
    subject: Subjects.BusinessSubCategoryCreated=Subjects.BusinessSubCategoryCreated;
}