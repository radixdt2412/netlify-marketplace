import { Subjects,Publisher,BusinessCategoryUpdatedEvent } from "@rx-marketplace/common"

export class BusinessCategoryUpdatePublisher extends Publisher<BusinessCategoryUpdatedEvent>{
    subject: Subjects.BusinessCategoryUpdated=Subjects.BusinessCategoryUpdated;
}