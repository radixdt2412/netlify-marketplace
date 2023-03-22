
import { Subjects,Publisher,ProductSKUsCreatedEvent } from "@rx-marketplace/common";

export class ProductSKUsCreatedPublisher extends Publisher<ProductSKUsCreatedEvent>{
    subject: Subjects.ProductSKUsCreated=Subjects.ProductSKUsCreated;
}