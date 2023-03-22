import { Subjects } from "../enums/subjects";
export interface OrderCreatedEvent{
    subject:Subjects.OrderCreated,
    data:{
        id:string,
        customerId: string;
        rewardPoints: number;
        addressId: string;
        zipCode: number;
        deliveryMode: string;
        payableAmount: number;
        couponId?: string | null;
        discountPrice: number;
        originalPrice: number;
        remarks: string;
        orderStatus: string;
        couponDiscountPrice:number
    }
}