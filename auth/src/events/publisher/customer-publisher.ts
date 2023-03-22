
import { Subjects,Publisher,CustomerCreatedEvent } from "@rx-marketplace/common";

export class CutomerCreatedPublisher extends Publisher<CustomerCreatedEvent>{
    subject: Subjects.CustomerCreated=Subjects.CustomerCreated;
}