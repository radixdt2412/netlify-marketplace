import { Message } from "node-nats-streaming";
import { Subjects,Listener, AttributeUpdateEvent } from "@rx-marketplace/common";
import { BusinessCategory } from "../../models/business-category";
import { queueGroup } from "./queue-group-name";
import { Attribute } from "../../models/attribute";

export class AttributeValueCreateListener extends Listener<AttributeUpdateEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AttributeUpdate=Subjects.AttributeUpdate;
    async onMessage(data:AttributeUpdateEvent['data'],msg:Message){
         const {id,name,type,isAcive}=data
         const attributData = Attribute.findByIdAndUpdate(id,{
           name:name,type:type,isActive:isAcive
         });
         msg.ack();
    }
}
    