import mongoose, { ObjectId } from "mongoose";

export interface CountryAttrs {
    countryName: string;
}

interface CountryModel extends mongoose.Model<CountryDoc> {
    build(attrs: CountryAttrs): CountryDoc;
}

export interface CountryDoc extends mongoose.Document {
    countryName: string;
    isActive:boolean;
    createdAt: Date;
    updatedAt: Date;

}

const countrySchema = new mongoose.Schema({
    countryName: {type: String,required: true,unique: true},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

countrySchema.statics.build = (attrs: CountryAttrs) => {
    return new Country(attrs);
}

const Country = mongoose.model<CountryDoc, CountryModel>('country', countrySchema);

export { Country };