import mongoose, { ObjectId } from "mongoose";
import { StateDoc } from "./state";

export interface CityAttrs {
    cityName: string;
    stateId: string;
}

interface CityModel extends mongoose.Model<CityDoc> {
    build(attrs: CityAttrs): CityDoc;
}

export interface CityDoc extends mongoose.Document {
    cityName: string;
    stateId: StateDoc;
}

const citySchema = new mongoose.Schema({
    cityName: { type: String, required: true, unique: true},
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'state'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    is_delete: { type: Boolean, default: false }
}, );

citySchema.pre('save', async function (done) {

})

citySchema.statics.build = (attrs: CityAttrs) => {
    return new City(attrs);
}

const City = mongoose.model<CityDoc, CityModel>('city', citySchema);

export { City };