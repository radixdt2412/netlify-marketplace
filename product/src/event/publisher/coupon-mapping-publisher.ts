
import { Subjects,Publisher,CouponMappingCreatedEvent } from "@rx-marketplace/common";

export class CouponMappingCreatedPublisher extends Publisher<CouponMappingCreatedEvent>{
    subject: Subjects.CouponMappingCreated=Subjects.CouponMappingCreated;
}