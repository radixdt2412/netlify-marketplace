import { Subjects } from "../enums/subjects";
export interface CouponCreatedEvent{
    subject:Subjects.CouponCreated,
    data:{
        id:string,
        name:string,
        discountPercentage:number,
        description:string,
        couponCode:string,
        isRepeatCoupon:boolean,
        maxUserLimit:number,
        maxDiscountAmount:number,
        createdFor:string,
        startDate:Date,
        endDate:Date,
        isMonthlyActive:boolean,
        couponAuthor:string,
        imageUrl:string,
        minOrderAmount:number,
        isActive:boolean,
    }
}
