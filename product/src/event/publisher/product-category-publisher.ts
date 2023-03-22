
import { Subjects,Publisher,ProductCategoryCreatedEvent } from "@rx-marketplace/common";

export class ProductCategoryCreatedPublisher extends Publisher<ProductCategoryCreatedEvent>{
    subject: Subjects.ProductCategoryCreated=Subjects.ProductCategoryCreated;
}