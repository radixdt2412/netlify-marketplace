import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderProductCreatedEvent } from "@rx-marketplace/common";
import { Store } from "../../models/store";
import { queueGroup } from "./queue-group-name";
import { SKUS } from "../../models/product-skus";
import { Product } from "../../models/product";
import { ProductUpdatedPublisher } from "../publisher/product-update-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { ProductSKUsUpdatePublisher } from "../publisher/product-skus-update-publisher";

export class OrderProductCreatedListener extends Listener<OrderProductCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.OrderProductCreated = Subjects.OrderProductCreated;
    async onMessage(data: OrderProductCreatedEvent['data'], msg: Message) {
        const { id,
            productId,
            addOnsId,
            storeId,
            productItemId,
            quantity,
            orderId,
            refundAmount,
            penaltyAmount,
            orderStatus,
            couponId,
            discountPrice,
            originalPrice,
            payableAmount } = data

        const skusData = await SKUS.findById(productItemId);
        if (skusData) {
            const c = skusData.qty - quantity;
            await SKUS.findByIdAndUpdate(productItemId, { qty: c });
            await new ProductSKUsUpdatePublisher(natsWrapper.client).publish({
                id: skusData.id.toString(),
                productId: productId,
                name: skusData.name,
                description: skusData.description,
                isVariantBasedPrice: skusData.isVariantBasedPrice,
                price: skusData.price,
                qty: c,
                isVariantHasImage: skusData.isVariantHasImage,
                imageUrl: skusData.imageUrl
            })
            
            const productData = await Product.findById(productId);
            if (productData) {
                const c = productData.quantity - quantity;
                await Product.findByIdAndUpdate(productId, { quantity: c })
                await new ProductUpdatedPublisher(natsWrapper.client).publish({
                    id: productData.id,
                    name: productData.name,
                    description: productData.description,
                    productSubCategoryId: productData.productSubCategoryId.toString(),
                    imageUrl: productData.imageUrl,
                    brandName: productData.brandName,
                    basePrice: productData.basePrice,
                    quantity: c,
                    createdBy: productData.createdBy,
                    isActive: true
                })
            }
        } else {
            const productData = await Product.findById(productId);
            if (productData) {
                const c = productData.quantity - quantity;
                await Product.findByIdAndUpdate(productId, { quantity: c })
                await new ProductUpdatedPublisher(natsWrapper.client).publish({
                    id: productData.id,
                    name: productData.name,
                    description: productData.description,
                    productSubCategoryId: productData.productSubCategoryId.toString(),
                    imageUrl: productData.imageUrl,
                    brandName: productData.brandName,
                    basePrice: productData.basePrice,
                    quantity: c,
                    createdBy: productData.createdBy,
                    isActive: true
                })
            }

        }

        msg.ack();
    }
}
