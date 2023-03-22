import mongoose, { ObjectId } from "mongoose";
import { CountryDoc } from "./country";

export interface StateAttrs {
    stateName: string;
    countryId: string;
}

interface StateModel extends mongoose.Model<StateDoc> {
    build(attrs: StateAttrs): StateDoc;
}

export interface StateDoc extends mongoose.Document {
    stateName: string;
    countryId: CountryDoc;
    createdAt: Date;
    updatedAt: Date;
}

const stateSchema = new mongoose.Schema({
    stateName: { type: String, required: true, unique: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'country' },
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

stateSchema.pre('save', async function (done) {})

stateSchema.statics.build = (attrs: StateAttrs) => {
    return new State(attrs);
}

const State = mongoose.model<StateDoc, StateModel>('state', stateSchema);

export { State };