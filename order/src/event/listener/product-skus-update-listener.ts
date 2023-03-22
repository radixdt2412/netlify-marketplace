import { Message } from "node-nats-streaming";
import { Subjects,Listener, ProductSKUsUpdateEvent } from "@rx-marketplace/common";
import { queueGroup } from "./queue-group-name";
import { SKUS } from "../../models/product-skus";

export class ProductSKUsUpdateListener extends Listener<ProductSKUsUpdateEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.ProductSKUsUpdate=Subjects.ProductSKUsUpdate;
    async onMessage(data:ProductSKUsUpdateEvent['data'],msg:Message){
         const {id,description,imageUrl,isVariantBasedPrice,isVariantHasImage,name,price,productId,qty }=data
         await SKUS.findByIdAndUpdate(id,{
          name:name,description:description,imageUrl:imageUrl,qty:qty,isVariantBasedPrice:isVariantBasedPrice,isVariantHasImage:isVariantHasImage,price:price,productId:productId
         });
         msg.ack();
    }
}
    