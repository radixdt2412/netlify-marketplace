import { Subjects,Publisher,AdminPermissionUserCreatedEvent } from "@rx-marketplace/common";

export class AdminPermissionCreatedPublisher extends Publisher<AdminPermissionUserCreatedEvent>{
    subject: Subjects.AdminPermissionCreated=Subjects.AdminPermissionCreated;
}