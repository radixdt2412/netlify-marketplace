
import { Subjects,Publisher,AttributeUpdateEvent } from "@rx-marketplace/common";

export class AttributeUpdatePublisher extends Publisher<AttributeUpdateEvent>{
    subject: Subjects.AttributeUpdate=Subjects.AttributeUpdate;
}