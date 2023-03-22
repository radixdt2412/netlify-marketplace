import { Subjects,Publisher,CustomerAddressCreatedEvent } from "@rx-marketplace/common";

export class CustomerAddressCreatedPublisher extends Publisher<CustomerAddressCreatedEvent>{
    subject: Subjects.CustomerAddressCreated=Subjects.CustomerAddressCreated;
}