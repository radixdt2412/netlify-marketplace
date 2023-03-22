import { Message } from "node-nats-streaming";
import { Subjects,Listener, AttributeCreatedEvent } from "@rx-marketplace/common";
import { BusinessCategory } from "../../models/business-category";
import { queueGroup } from "./queue-group-name";
import { Attribute } from "../../models/attribute";

export class AttributeCreatedListener extends Listener<AttributeCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AttributeCreated=Subjects.AttributeCreated;
    async onMessage(data:AttributeCreatedEvent['data'],msg:Message){
         const {id,name,type,isAcive}=data
         const attributData = Attribute.build({
           name:name,type:type
         });
         attributData._id=id;
         await attributData.save();
         msg.ack();
    }
}
    