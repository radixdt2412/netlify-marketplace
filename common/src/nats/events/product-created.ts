import { Subjects } from "../enums/subjects";
export interface ProductCreatedEvent{
    subject:Subjects.ProductCreated,
    data:{
        id:string,
        name: string;
        description: string;
        productSubCategoryId: string;
        imageUrl: string[];
        storeId: string;
        brandName: string;
        basePrice: number;
        quantity: number;
        calculateOnBasePrice?: boolean;
        relatableProducts?: string[],
        createdBy: string,
        isActive:boolean;
        isDiscountPercentage:boolean,
        discount:number,
        discountedValue:number,
        maxDiscount:number,
    }
}