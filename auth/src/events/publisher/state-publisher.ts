import { Subjects,Publisher,StateCreatedEvent } from "@rx-marketplace/common";

export class StateCreatedPublisher extends Publisher<StateCreatedEvent>{
    subject: Subjects.StateCreated=Subjects.StateCreated;
}