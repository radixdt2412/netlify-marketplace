import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessUserCreatedEvent } from "@rx-marketplace/common";
import { BusinessUser } from "../../models/business-user";
import { queueGroup } from "./queue-group-name";

export class BusinessUserCreatedListener extends Listener<BusinessUserCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessUserCreated=Subjects.BusinessUserCreated;
    async onMessage(data:BusinessUserCreatedEvent['data'],msg:Message){
         const {id,email,phoneNumber, name,isActive,createdBy,storeId}=data
         const userData = BusinessUser.build({
            email,phoneNumber, name,createdBy,store:storeId       
         })
         userData._id=id
         await userData.save();
         msg.ack();
    }
}
    