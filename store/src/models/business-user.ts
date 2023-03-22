import mongoose, { ObjectId } from "mongoose";

export interface BusinessUserAttrs {
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
    createdBy?: string | null; 
}

interface BusinessUserModel extends mongoose.Model<BusinessUserDoc> {
    build(attrs: BusinessUserAttrs): BusinessUserDoc;
}

export interface BusinessUserDoc extends mongoose.Document {
    email: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: number;
    name: string;
    password: string;
    isActive: boolean;
    createdBy: BusinessUserDoc; // userId
}

const BusinessUserSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number || null, },
    name: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId || null, default: null, ref: 'BusinessUser' },
    accountType: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountType' },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );


BusinessUserSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessUserSchema.statics.build = (attrs: BusinessUserAttrs) => {
    return new BusinessUser(attrs);
}

const BusinessUser = mongoose.model<BusinessUserDoc, BusinessUserModel>('BusinessUser', BusinessUserSchema);

export { BusinessUser };