import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminPermissionUserCreatedEvent } from "@rx-marketplace/common";

import { queueGroup } from "./queue-group-name";
import { AdminPermissions } from "../../models/admin-permissions";

export class AdminPermissioCreatedListener extends Listener<AdminPermissionUserCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminPermissionCreated=Subjects.AdminPermissionCreated;
    async onMessage(data:AdminPermissionUserCreatedEvent['data'],msg:Message){
         const {id,tableName,isCreate,isRead,isUpdate,isDelete}=data
         const AdminPermissionsData = AdminPermissions.build({
            tableName:tableName,isRead:isRead,isCreate:isCreate,isUpdate:isUpdate,isDelete:isDelete
         })
         AdminPermissionsData._id=id;
         await AdminPermissionsData.save();
         msg.ack();
    }
}
    