import mongoose, { ObjectId } from "mongoose";

export interface CustomerAttrs {
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
    build(attrs: CustomerAttrs): CustomerDoc;
}

export interface CustomerDoc extends mongoose.Document {
    email: string;
    phoneNumber: number;
    name: string;

}

const customerSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number || null, },
    name: { type: String },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );


customerSchema.statics.build = (attrs: CustomerAttrs) => {
    return new Customer(attrs);
}

const Customer = mongoose.model<CustomerDoc, CustomerModel>('CustomerUser', customerSchema);

export { Customer };