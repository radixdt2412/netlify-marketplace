
import { Subjects,Publisher,ProductSKUsUpdateEvent } from "@rx-marketplace/common";

export class ProductSKUsUpdatePublisher extends Publisher<ProductSKUsUpdateEvent>{
    subject: Subjects.ProductSKUsUpdate=Subjects.ProductSKUsUpdate;
}