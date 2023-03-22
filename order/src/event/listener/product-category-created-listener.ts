import { Message } from "node-nats-streaming";
import { Subjects,Listener,ProductCategoryCreatedEvent } from "@rx-marketplace/common";
import { queueGroup } from "./queue-group-name";
import { ProductCategory } from "../../models/product-category";

export class ProductCategoryCreatedListener extends Listener<ProductCategoryCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.ProductCategoryCreated=Subjects.ProductCategoryCreated;
    async onMessage(data:ProductCategoryCreatedEvent['data'],msg:Message){
         const {id,name,description,businessSubCategoryId,isActive}=data
         const productCategoryData = ProductCategory.build({
            name:name,
            description:description,
            businessSubCategoryId:businessSubCategoryId,
            isActive:isActive
         })
         productCategoryData._id=id
         await productCategoryData.save();
         msg.ack();
    }
}
    