import mongoose, { ObjectId } from "mongoose";
import { BusinessSubCategoryDoc } from "./business-sub-category";
import { BusinessUserDoc } from "./business-user";

export interface BusinessProfileAttrs {
    BusinessUsers: string[],
    name: string,
    tagLine?: string,
    businessSubCategoryId: string,
    phoneNumber?: number,
    description?: string,
    coverPhoto?: string,
    latitude?: number,
    longitude?: number,
    welcomeMessage?: string,

}

interface BusinessProfileModel extends mongoose.Model<BusinessProfileDoc> {
    build(attrs: BusinessProfileAttrs): BusinessProfileDoc;
}

export interface BusinessProfileDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: number;
    name: string;
    followers: number,
    following: number,
    description: string,
    coverPhoto: string,
    businessSubCategoryId: BusinessSubCategoryDoc,
    qrCode: string,
    latitude: number,
    longitude: number,
    BusinessUsers: BusinessUserDoc[]
    isActive:boolean;
}

const BusinessProfileSchema = new mongoose.Schema({
    BusinessUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessUser' },],
    name: { type: String },
    tagLine: { type: String, default: null },
    description: { type: String, },
    coverPhoto: { type: String, },
    businessSubCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessSubCategory' },
    privacyPolicy: { type: String, default: null },
    termsAndCondition: { type: String, default: null },
    qrCode: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    phoneNumber: { type: Number, },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    isKYCApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    minOrderAmount: { type: Number, default: 0 },
    welcomeMessage: { type: String, default: "Welcome to My business profile" },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

BusinessProfileSchema.pre('save', async function (done) {
})

BusinessProfileSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessProfileSchema.statics.build = (attrs: BusinessProfileAttrs) => {
    return new BusinessProfile(attrs);
}

const BusinessProfile = mongoose.model<BusinessProfileDoc, BusinessProfileModel>('BusinessProfile', BusinessProfileSchema);

export { BusinessProfile };