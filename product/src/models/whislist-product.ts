import mongoose, { ObjectId } from "mongoose";

export interface ProductWhishlistAttrs {
    customerId:string;
    productId:string;
}

interface ProductWhishlistModel extends mongoose.Model<ProductWhishlistDoc> {
    build(attrs: ProductWhishlistAttrs): ProductWhishlistDoc;
}

export interface ProductWhishlistDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    customerId:string;
    productId:string;
}

const ProductWhishlistSchema = new mongoose.Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,},
    productId:{type:mongoose.Schema.Types.ObjectId,},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

ProductWhishlistSchema.pre('save', async function (done) {
    done();
})
ProductWhishlistSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductWhishlistSchema.statics.build = (attrs: ProductWhishlistAttrs) => {
    return new ProductWhishlist(attrs);
}

const ProductWhishlist = mongoose.model<ProductWhishlistDoc, ProductWhishlistModel>('ProductWhishlist', ProductWhishlistSchema);

export { ProductWhishlist };