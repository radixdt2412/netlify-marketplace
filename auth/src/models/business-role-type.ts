import mongoose, { ObjectId } from "mongoose";

export interface BusinessRoleTypeAttrs {
    tableName: string;
    isRead: boolean;
    isCreate: boolean;
    isDelete: boolean;
    isUpdate: boolean;
}

interface BusinessRoleTypeModel extends mongoose.Model<BusinessRoleTypeDoc> {
    build(attrs: BusinessRoleTypeAttrs): BusinessRoleTypeDoc;
}

export interface BusinessRoleTypeDoc extends mongoose.Document {
    tableName: string;
    isRead: boolean;
    isCreate: boolean;
    isDelete: boolean;
    isUpdate: boolean;
}

const BusinessRoleTypeSchema = new mongoose.Schema({
    tableName: { type: String,enum:['product','order','store','businessProfile'] },
    isRead: { type: Boolean, default: false },
    isCreate: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isUpdate: { type: Boolean, default: false },
}, );

BusinessRoleTypeSchema.pre('save', async function (done) {

})

BusinessRoleTypeSchema.statics.build = (attrs: BusinessRoleTypeAttrs) => {
    return new BusinessRoleType(attrs);
}

const BusinessRoleType = mongoose.model<BusinessRoleTypeDoc, BusinessRoleTypeModel>('BusinessRoleType', BusinessRoleTypeSchema);

export { BusinessRoleType };