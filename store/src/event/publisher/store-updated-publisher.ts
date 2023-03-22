import { Subjects,Publisher,StoreUpdatedEvent } from "@rx-marketplace/common"

export class StoreUpdatedPublisher extends Publisher<StoreUpdatedEvent>{
    subject: Subjects.StoreUpdated=Subjects.StoreUpdated;
}