
import { Subjects,Publisher,ProductCreatedEvent } from "@rx-marketplace/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent>{
    subject: Subjects.ProductCreated=Subjects.ProductCreated;
}