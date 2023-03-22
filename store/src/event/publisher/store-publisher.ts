import { Subjects,Publisher,StoreCreatedEvent } from "@rx-marketplace/common"

export class StoreCreatedPublisher extends Publisher<StoreCreatedEvent>{
    subject: Subjects.StoreCreated=Subjects.StoreCreated;
}