import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductVariantCombinationCreatedEvent } from "@rx-marketplace/common";
import { queueGroup } from "./queue-group-name";
import { ProductVariantCombination } from "../../models/product-variant-combination";

export class ProductVariantListener extends Listener<ProductVariantCombinationCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.ProductVariantCombinationCreated = Subjects.ProductVariantCombinationCreated;
    async onMessage(data: ProductVariantCombinationCreatedEvent['data'], msg: Message) {
        const { id,productSKUsId,attributeValueId,attributeId} = data
        const userData = ProductVariantCombination.build({
            productSKUsId: productSKUsId,
            attributeValueId:attributeValueId ,
            attributeId: attributeId
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}
