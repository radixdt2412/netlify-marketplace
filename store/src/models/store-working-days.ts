import mongoose, { ObjectId } from "mongoose";
import { StoreDoc } from "./store";

export interface storeWorkingDayAttrs {
    day: string;
    storeId: string;
    startTime:string;
    closeTime:string;
    startBreakTime:string;
    endBreakTime:string;
}

interface storeWorkingDayModel extends mongoose.Model<storeWorkingDayDoc> {
    build(attrs: storeWorkingDayAttrs): storeWorkingDayDoc;
}

export interface storeWorkingDayDoc extends mongoose.Document {
    day: string;
    startTime:string;
    closeTime:string;
    storeId: StoreDoc;
    startBreakTime:string;
    endBreakTime:string;
}

const storeWorkingDaySchema = new mongoose.Schema({
    day: { type: String,enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday' ] },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'store'},
    startTime:{type:String},
    closeTime:{type:String},
    startBreakTime:{type:String},
    endBreakTime:{type:String},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

storeWorkingDaySchema.pre('save', async function (done) {})

storeWorkingDaySchema.statics.build = (attrs: storeWorkingDayAttrs) => {
    return new storeWorkingDay(attrs);
}

const storeWorkingDay = mongoose.model<storeWorkingDayDoc, storeWorkingDayModel>('storeWorkingDay', storeWorkingDaySchema);

export { storeWorkingDay };