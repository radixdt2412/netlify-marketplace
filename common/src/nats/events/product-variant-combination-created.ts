import { Subjects } from "../enums/subjects";
export interface ProductVariantCombinationCreatedEvent{
    subject:Subjects.ProductVariantCombinationCreated,
    data:{
        id:string;
        productSKUsId: string,
        attributeValueId: string,
        attributeId:string,
    }
}