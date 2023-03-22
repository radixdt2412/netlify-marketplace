
import { Subjects,Publisher,ProductVariantCombinationCreatedEvent } from "@rx-marketplace/common";

export class ProductVariantPublisher extends Publisher<ProductVariantCombinationCreatedEvent>{
    subject: Subjects.ProductVariantCombinationCreated=Subjects.ProductVariantCombinationCreated;
}