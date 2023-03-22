
import { Subjects,Publisher,AttributeValueUpdateEvent } from "@rx-marketplace/common";

export class AttributeValueUpdatePublisher extends Publisher<AttributeValueUpdateEvent>{
    subject: Subjects.AttributeValueUpdate=Subjects.AttributeValueUpdate;
}