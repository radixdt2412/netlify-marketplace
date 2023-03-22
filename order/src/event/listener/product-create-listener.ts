import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductCreatedEvent } from "@rx-marketplace/common";
import { Product } from "../../models/product";
import { queueGroup } from "./queue-group-name";

export class ProductCreatedListener extends Listener<ProductCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const { id, name, description, productSubCategoryId,imageUrl,storeId,brandName,basePrice,quantity,calculateOnBasePrice,relatableProducts,discount,discountedValue,maxDiscount,createdBy} = data
        const userData = Product.build({
            name: name,
            description: description,
            productSubCategoryId: productSubCategoryId,
            imageUrl: imageUrl,
            storeId: storeId,
            brandName: brandName,
            highlights: "",
            basePrice: basePrice,
            quantity: quantity,
            createdBy: createdBy,
            isDiscountPercentage: false,
            discount: discount,
            discountedValue: discountedValue,
            maxDiscount: maxDiscount
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}
