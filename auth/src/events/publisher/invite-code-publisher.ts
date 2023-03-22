import { Subjects,Publisher,InvitionCodeCreatedEvent } from "@rx-marketplace/common";

export class InviteCodeCreatedPublisher extends Publisher<InvitionCodeCreatedEvent>{
    subject: Subjects.InvitionCodeCreated=Subjects.InvitionCodeCreated;
}