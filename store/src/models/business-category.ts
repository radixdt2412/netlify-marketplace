import mongoose, { ObjectId } from "mongoose";

export interface BusinessCategoryAttrs {
    name:string,
    description:string,
    isActive:boolean,
    imageUrl:string,    
}

// interface for categorymodel pass
interface BusinessCategoryModel extends mongoose.Model<BusinessCategoryDoc> {
    build(attrs: BusinessCategoryAttrs): BusinessCategoryDoc;
}

// interface for single category properties
export interface BusinessCategoryDoc extends mongoose.Document {
    imageUrl:string,    
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description:string;
    isActive:boolean;
}

const BusinessCategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    imageUrl:{type:String},    
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

BusinessCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessCategorySchema.statics.build = (attrs: BusinessCategoryAttrs) => {
    return new BusinessCategory(attrs);
}

const BusinessCategory = mongoose.model<BusinessCategoryDoc, BusinessCategoryModel>('BusinessCategory', BusinessCategorySchema);

export { BusinessCategory };