import { Subjects } from "../enums/subjects";
export interface ProductSKUsUpdateEvent{
    subject:Subjects.ProductSKUsUpdate,
    data:{
        id:string;
        productId:string;
        name:string;
        description:string;
        isVariantBasedPrice:boolean;
        price:number;
        qty:number;
        isVariantHasImage:boolean;
        imageUrl:string;
    }
}