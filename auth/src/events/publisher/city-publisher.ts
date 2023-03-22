import { Subjects,Publisher,CityCreatedEvent } from "@rx-marketplace/common";

export class CityCreatedPublisher extends Publisher<CityCreatedEvent>{
    subject: Subjects.CityCreated=Subjects.CityCreated;
}