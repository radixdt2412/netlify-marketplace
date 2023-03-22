
import { Subjects,Publisher,ProductSubCategoryCreatedEvent } from "@rx-marketplace/common";

export class ProductSubCategoryCreatedPublisher extends Publisher<ProductSubCategoryCreatedEvent>{
    subject: Subjects.ProductSubCategoryCreated=Subjects.ProductSubCategoryCreated;
}