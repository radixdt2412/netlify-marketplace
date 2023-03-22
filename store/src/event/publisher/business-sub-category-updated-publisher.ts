import { Subjects,Publisher,BusinessSubCategoryUpdatedEvent } from "@rx-marketplace/common"

export class BusinessSubCategoryUpdatePublisher extends Publisher<BusinessSubCategoryUpdatedEvent>{
    subject: Subjects.BusinessSubCategoryUpdated=Subjects.BusinessSubCategoryUpdated;
}