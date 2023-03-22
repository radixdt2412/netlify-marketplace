import { Message } from "node-nats-streaming";
import { Subjects,Listener, ProductUpdateEvent } from "@rx-marketplace/common";
import { queueGroup } from "./queue-group-name";
import { Product } from "../../models/product";

export class ProductUpdateListener extends Listener<ProductUpdateEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.ProductUpdated=Subjects.ProductUpdated;
    async onMessage(data:ProductUpdateEvent['data'],msg:Message){
         const {id,name, description, productSubCategoryId,imageUrl,brandName,basePrice,quantity,calculateOnBasePrice,relatableProducts,createdBy}=data
         const attributData =await Product.findByIdAndUpdate(id,{
          name:name,description:description,productSubCategoryId:productSubCategoryId,imageUrl:imageUrl,brandName:brandName,quantity:quantity,calculateOnBasePrice:calculateOnBasePrice,relatableProducts:relatableProducts,createdBy:createdBy
         });
         msg.ack();
    }
}
    