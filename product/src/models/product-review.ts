import mongoose, { ObjectId } from "mongoose";
import { CustomerDoc } from "./customer";

export interface ProductReviewAttrs {
   productId:string;
   customerId:string;
   rating:number;
   comment:string;
   title:string;
   imageURL:string[];
}

interface ProductReviewModel extends mongoose.Model<ProductReviewDoc> {
    build(attrs: ProductReviewAttrs): ProductReviewDoc;
}

export interface ProductReviewDoc extends mongoose.Document {
    customerId:CustomerDoc;
    productId:string;
    rating:number;
    comment:string;
    title:string,
    imageURL:string[];
}

const ProductReviewSchema = new mongoose.Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,ref:'CustomerUser'},
    productId: { type: mongoose.Schema.Types.ObjectId, ref:'Product'},
    title:{type:String},
    rating: { type: Number,default:1.1 },
    comment: { type: String },
    imageURL:[{type:String}],
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

ProductReviewSchema.pre('save', async function (done) {
    done();
})
ProductReviewSchema.pre('update', async function (done) {
    done();
})

ProductReviewSchema.statics.build = (attrs: ProductReviewAttrs) => {
    return new ProductReview(attrs);
}

const ProductReview = mongoose.model<ProductReviewDoc, ProductReviewModel>('ProductReview', ProductReviewSchema);

export { ProductReview };