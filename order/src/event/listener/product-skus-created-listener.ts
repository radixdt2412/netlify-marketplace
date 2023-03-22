import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductSKUsCreatedEvent } from "@rx-marketplace/common";

import { queueGroup } from "./queue-group-name";
import { SKUS } from "../../models/product-skus";

export class ProductSKUSListener extends Listener<ProductSKUsCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.ProductSKUsCreated = Subjects.ProductSKUsCreated;
    async onMessage(data: ProductSKUsCreatedEvent['data'], msg: Message) {
        const { id,description,imageUrl,isVariantBasedPrice,isVariantHasImage,name,price,productId,qty} = data
        const userData = SKUS.build({
            name: name,
            description: description,
            imageUrl: imageUrl,
            isVariantBasedPrice:isVariantBasedPrice,
            isVariantHasImage:isVariantHasImage,
            price:price,
            productId:productId,
            qty:qty
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}
