
import { Subjects,Publisher,OrderCreatedEvent } from "@rx-marketplace/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
}