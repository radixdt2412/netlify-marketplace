
import { Subjects,Publisher,AttributeCreatedEvent } from "@rx-marketplace/common";

export class AttributeCreatedPublisher extends Publisher<AttributeCreatedEvent>{
    subject: Subjects.AttributeCreated=Subjects.AttributeCreated;
}