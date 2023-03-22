import { Subjects,Publisher,BusinessUserCreatedEvent } from "@rx-marketplace/common";

export class BusinessUserCreatedPublisher extends Publisher<BusinessUserCreatedEvent>{
    subject: Subjects.BusinessUserCreated=Subjects.BusinessUserCreated;
}