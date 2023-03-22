import mongoose, { ObjectId } from "mongoose";
import { StateDoc } from "./state";


export interface DeviceAttrs {
    userId: string,
    deviceId: string,
    fcmToken:string,
    deviceType:string,
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
    build(attrs: DeviceAttrs): DeviceDoc;
}

export interface DeviceDoc extends mongoose.Document {
    userId: string,
    deviceId: string,
    fcmToken:string,
    deviceType:string,
}

const DeviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true},
    deviceId: { type: String, required: true,},
    fcmToken:{type:String,required:true},
    deviceType:{type:String,required:true},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
},);

DeviceSchema.statics.build = (attrs: DeviceAttrs) => {
    return new Device(attrs);
}

const Device = mongoose.model<DeviceDoc, DeviceModel>('Device', DeviceSchema);

export { Device };