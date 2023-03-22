import { Message } from "node-nats-streaming";
import { Subjects,Listener, AttributeValueUpdateEvent } from "@rx-marketplace/common";
import { BusinessCategory } from "../../models/business-category";
import { queueGroup } from "./queue-group-name";
import { Attribute } from "../../models/attribute";
import { AttributeValue } from "../../models/attribute-value";

export class AttributeValueUpdateListener extends Listener<AttributeValueUpdateEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AttributeValueUpdate=Subjects.AttributeValueUpdate;
    async onMessage(data:AttributeValueUpdateEvent['data'],msg:Message){
         const {id,value,attributeId,isAcive}=data
         const attributData =await AttributeValue.findByIdAndUpdate(id,{
          value:value,attributeId:attributeId,isActive:isAcive
         });
         msg.ack();
    }
}
    