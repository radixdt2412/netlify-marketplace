
import { Subjects,Publisher,OrderProductCreatedEvent } from "@rx-marketplace/common";

export class OrderPrdouctCreatedPublisher extends Publisher<OrderProductCreatedEvent>{
    subject: Subjects.OrderProductCreated=Subjects.OrderProductCreated;
}