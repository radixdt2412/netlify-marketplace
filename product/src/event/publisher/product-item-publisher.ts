
import { Subjects,Publisher,ProductItemCreatedEvent } from "@rx-marketplace/common";

export class ProductItemCreatedPublisher extends Publisher<ProductItemCreatedEvent>{
    subject: Subjects.ProductItemCreated=Subjects.ProductItemCreated;
}