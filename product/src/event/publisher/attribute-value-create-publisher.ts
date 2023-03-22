
import { Subjects,Publisher,AttributeValueCreatedEvent } from "@rx-marketplace/common";

export class AttributeValueCreatedPublisher extends Publisher<AttributeValueCreatedEvent>{
    subject: Subjects.AttributeValueCreated=Subjects.AttributeValueCreated;
}