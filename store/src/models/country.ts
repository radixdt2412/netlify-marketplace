import mongoose, { ObjectId } from "mongoose";

export interface CountryAttrs {
    countryName: string;
}

interface CountryModel extends mongoose.Model<CountryDoc> {
    build(attrs: CountryAttrs): CountryDoc;
}

export interface CountryDoc extends mongoose.Document {
    countryName: string;
    createdAt: Date;
    updatedAt: Date;

}

const countrySchema = new mongoose.Schema({
    countryName: {type: String,required: true,unique: true},
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

countrySchema.pre('save', async function (done) {

})

countrySchema.statics.build = (attrs: CountryAttrs) => {
    return new Country(attrs);
}

const Country = mongoose.model<CountryDoc, CountryModel>('country', countrySchema);

export { Country };