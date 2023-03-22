import { Message } from "node-nats-streaming";
import { Subjects, Listener, CouponCreatedEvent } from "@rx-marketplace/common";
import { Country } from "../../models/country";
import { queueGroup } from "./queue-group-name";
import { Coupon } from "../../models/coupon";

export class CouponCreatedListener extends Listener<CouponCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.CouponCreated = Subjects.CouponCreated;
    async onMessage(data: CouponCreatedEvent['data'], msg: Message) {
        const { id, name,
            discountPercentage,
            couponCode,
            isRepeatCoupon,
            maxUserLimit,
            maxDiscountAmount,
            createdFor,
            startDate,
            endDate,
            isMonthlyActive,
            couponAuthor,
            imageUrl,description } = data
        const couponData = Coupon.build({
            name,
            discountPercentage,
            couponCode,
            isRepeatCoupon: isRepeatCoupon,
            maxUserLimit,
            maxDiscountAmount,
            createdFor,
            startDate,
            endDate,
            isMonthlyActive,
            couponAuthor,
            imageUrl,
            description: description,
            minOrderAmount: 0,
            isActive: false
        });

        couponData._id = id
        await couponData.save();
        msg.ack();
    }
}
