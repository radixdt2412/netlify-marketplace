import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminUserUpdatedEvent } from "@rx-marketplace/common";
import { City } from "../../models/city";
import { queueGroup } from "./queue-group-name";
import { Admin } from "../../models/admin";


export class AdminUpdateListener extends Listener<AdminUserUpdatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminUpdated=Subjects.AdminUpdated;
    async onMessage(data:AdminUserUpdatedEvent['data'],msg:Message){
         const {id,permissionId,isActive}=data
         const AdminData = Admin.findByIdAndUpdate(id,{ permissionId:permissionId,isActive:isActive });
         msg.ack();
    }
}
    