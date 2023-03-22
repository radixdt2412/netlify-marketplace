import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminCreatedEvent } from "@rx-marketplace/common";

import { queueGroup } from "./queue-group-name";
import { Admin } from "../../models/admin";

export class AdminCreatedListener extends Listener<AdminCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminCreated=Subjects.AdminCreated;
    async onMessage(data:AdminCreatedEvent['data'],msg:Message){
         const {id,userName,email,phoneNumber,roleId,createdBy,allowChangePassword}=data
         const AdminData = Admin.build({
             email: email, userName: userName, phoneNumber: phoneNumber, createdBy: createdBy, allowChangePassword: allowChangePassword,
             password: "",
             roleId: roleId
         })
         AdminData._id=id;
         await AdminData.save();
         msg.ack();
    }
}
    