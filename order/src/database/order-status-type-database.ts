import { Order } from "../models/order";
import { OrderStatusType } from "../models/order-status-type";

export class OrderStatusTypeDatabaseLayer {
    static async createOrderStatusType(req: any) {
        const data= OrderStatusType.build({name:req.body.name});
        await data.save();
        return data;
    }
    static async removeOrderStatusType(req: any) {
        const data = await OrderStatusType.findByIdAndUpdate(req.params.id,{$set:{isActive:false}});
        return;
    }
    static async updateOrderStatusType(req: any) {
        await OrderStatusType.findByIdAndUpdate(req.body.id,{$set:{name:req.body.name}});
        const data = await OrderStatusType.findById(req.body.id);
        return data;
    }
    static async getOrderStatusType(req: any) {
        const data = await OrderStatusType.find();
        return data;
    }
}