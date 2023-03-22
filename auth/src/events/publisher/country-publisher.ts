import { Subjects,Publisher,CountryCreatedEvent } from "@rx-marketplace/common";

export class CountryCreatedPublisher extends Publisher<CountryCreatedEvent>{
    subject: Subjects.CountryCreated=Subjects.CountryCreated;
}