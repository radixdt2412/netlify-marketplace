import { Subjects } from "../enums/subjects";
export interface ProductSKUsCreatedEvent{
    subject:Subjects.ProductSKUsCreated,
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