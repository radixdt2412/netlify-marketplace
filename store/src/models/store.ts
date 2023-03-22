import mongoose, { ObjectId } from "mongoose";
import { BusinessProfileDoc } from "./business-profile";
import { BusinessSubCategoryDoc } from "./business-sub-category";
import { BusinessUserDoc } from "./business-user";
import { CityDoc } from "./city";
import { CountryDoc } from "./country";
import { StateDoc } from "./state";

export interface StoreAttrs {
    phoneNumber: number;
    email: string;
    businessProfileId: string,
    businessSubCategoryId: string,
    description: string,
    name: string,
    latitude: number,
    longitude: number,
    city: CityDoc,
    state: StateDoc,
    country: CountryDoc,
    pinCode: number,
    imageUrl:string,
    addressLine1: string,
    addressLine2?: string,
    membershipId?: string,
    welcomeMessage?: string, 
    createdBy: BusinessUserDoc,
}

interface StoreModel extends mongoose.Model<StoreDoc> {
    build(attrs: StoreAttrs): StoreDoc;
}

export interface StoreDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: number;
    email: string;
    imageUrl:string;
    businessProfileId: BusinessProfileDoc,
    businessSubCategoryId: BusinessSubCategoryDoc,
    description: string,
    chat: boolean,
    pauseOrder: boolean,
    name: string,
    rating: number,
    latitude: number,
    longitude: number,
    city: CityDoc,
    state: StateDoc,
    country: CountryDoc,
    pinCode: number,
    addressLine1: string,
    addressLine2: string,
    isActive: boolean,
    membershipId: string,
    welcomeMessage: string,
    isApprovedByAdmin: boolean,
    brodcastCount: number,
    createdBy: BusinessUserDoc,
}

const StoreSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, default: null, require: true },
    description: { type: String, },
    imageUrl: { type: String, },
    businessSubCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessSubCategory' },
    businessProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfileId' },
    rating: { type: Number, default: 0 },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    addressLine1: { type: String },
    addressLine2: { type: String },
    pinCode: { type: Number },
    chat: { type: Boolean, default: false },
    pauseOrder: { type: Boolean, default: false },
    phoneNumber: { type: Number },
    isActive: { type: Boolean, default: false },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default: null },
    isApprovedByAdmin: { type: Boolean, default: false },
    welcomeMessage: { type: String, default: "Welcome to My business profile" },
    brodcastCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessUser' },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
},);

StoreSchema.pre('save', async function (done) {})

StoreSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

StoreSchema.statics.build = (attrs: StoreAttrs) => {
    return new Store(attrs);
}

const Store = mongoose.model<StoreDoc, StoreModel>('Store', StoreSchema);

export { Store };