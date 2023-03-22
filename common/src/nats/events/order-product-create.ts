import { Subjects } from "../enums/subjects";
export interface OrderProductCreatedEvent{
    subject:Subjects.OrderProductCreated,
    data:{
        id:string,
        productId: string,
        addOnsId?: string | null,
        storeId: string,
        productItemId?: string | null,
        quantity: number,
        orderId: string,
        refundAmount?: number,
        penaltyAmount?: number,
        orderStatus: string,
        couponId?: string | null,
        discountPrice: number,
        originalPrice: number,
        payableAmount: number,
    }
}