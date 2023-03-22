
import { Subjects,Publisher,ProductUpdateEvent } from "@rx-marketplace/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdateEvent>{
    subject: Subjects.ProductUpdated=Subjects.ProductUpdated;
}