
import { Subjects,Publisher,CouponCreatedEvent } from "@rx-marketplace/common";

export class CouponCreatedPublisher extends Publisher<CouponCreatedEvent>{
    subject: Subjects.CouponCreated=Subjects.CouponCreated;
}