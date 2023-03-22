import mongoose, { ObjectId } from "mongoose";
import { BusinessSubCategoryDoc } from "./business-sub-category";

export interface ProductCategoryAttrs {
    name:string,
    description:string,
    imageUrl:string,    
    isActive:boolean,
    businessSubCategoryId:string
}

interface ProductCategoryModel extends mongoose.Model<ProductCategoryDoc> {
    build(attrs: ProductCategoryAttrs): ProductCategoryDoc;
}

export interface ProductCategoryDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description:string;
    imageUrl:string,    
    isActive:boolean;
    businessSubCategoryId:BusinessSubCategoryDoc;
}

const ProductCategorySchema = new mongoose.Schema({
    name: { type: String },
    imageUrl:{type:String},
    description: {type: String},
    isActive: { type: Boolean, default: true },
    businessSubCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:'BusinessSubCategory'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

ProductCategorySchema.pre('save', async function (done) {
    done();
})
ProductCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductCategorySchema.statics.build = (attrs: ProductCategoryAttrs) => {
    return new ProductCategory(attrs);
}

const ProductCategory = mongoose.model<ProductCategoryDoc, ProductCategoryModel>('ProductCategory', ProductCategorySchema);

export { ProductCategory };