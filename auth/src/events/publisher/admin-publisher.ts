import { Subjects,Publisher,AdminCreatedEvent } from "@rx-marketplace/common";
export class AdminCreatedPublisher extends Publisher<AdminCreatedEvent>{
    subject: Subjects.AdminCreated=Subjects.AdminCreated;
}