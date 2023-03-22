import { Message } from "node-nats-streaming";
import { Subjects, Listener, CouponMappingCreatedEvent } from "@rx-marketplace/common";
import { Country } from "../../models/country";
import { queueGroup } from "./queue-group-name";
import { Coupon } from "../../models/coupon";
import {  CouponMapping } from "../../models/coupon-mapping";

export class CouponMappingCreatedListener extends Listener<CouponMappingCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.CouponMappingCreated = Subjects.CouponMappingCreated;
    async onMessage(data: CouponMappingCreatedEvent['data'], msg: Message) {
        const { id,couponId,
            isProduct,
            isCustomer,
            isStore,
            isProductCategory,
            isProductSubCategory,
            baseId,} = data
        const couponData = CouponMapping.build({
            couponId,
            isProduct,
            isCustomer,
            isStore,
            isProductCategory,
            isProductSubCategory,
            baseId,
        });

        couponData._id = id
        await couponData.save();
        msg.ack();
    }
}
