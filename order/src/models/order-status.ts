import mongoose, { ObjectId } from "mongoose";
import { OrderDoc } from "./order";
import { OrderProductDoc } from "./order-product";
import { OrderStatusTypeDoc } from "./order-status-type";

export interface OrderStatusAttrs {
    orderId: OrderDoc;
    orderProductId:OrderProductDoc;
    orderStatusTypeId: OrderStatusTypeDoc;
    date:Date;
}

interface OrderStatusModel extends mongoose.Model<OrderStatusDoc> {
    build(attrs: OrderStatusAttrs): OrderStatusDoc;
}

export interface OrderStatusDoc extends mongoose.Document {
    orderId: OrderDoc;
    orderStatusTypeId: OrderStatusTypeDoc;
    orderProductId:OrderProductDoc;
    date:Date;
}
const orderStatusSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    orderProductId:{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderProduct', required: true },
    orderStatusTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orderstatustype', required: true, },
    date: { type: Date, required: true, },
});

orderStatusSchema.statics.build = (attrs: OrderStatusAttrs) => {
    return new OrderStatus(attrs);
}

const OrderStatus = mongoose.model<OrderStatusDoc, OrderStatusModel>('Orderstatus', orderStatusSchema);
export { OrderStatus };