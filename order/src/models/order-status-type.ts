import mongoose, { ObjectId } from "mongoose";

export interface OrderStatusTypeAttrs {
    name: string;
}

interface OrderStatusTypeModel extends mongoose.Model<OrderStatusTypeDoc> {
    build(attrs: OrderStatusTypeAttrs): OrderStatusTypeDoc;
}

export interface OrderStatusTypeDoc extends mongoose.Document {
    order_status_type_name: string;
    isActive:Boolean;
}
const orderStatusTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isActive: { type: Boolean, default: true },
});

orderStatusTypeSchema.statics.build = (attrs: OrderStatusTypeAttrs) => {
    return new OrderStatusType(attrs);
}

const OrderStatusType = mongoose.model<OrderStatusTypeDoc, OrderStatusTypeModel>('Orderstatustype', orderStatusTypeSchema);
export { OrderStatusType };