import { BadRequestError } from "@rx-marketplace/common";
import mongoose from "mongoose";
import { OrderStatus } from "../models/order-status";

export class OrderStatusDatabaseLayer {
  static async removeOrderStatus(req: any) {
    const data = await OrderStatus.findByIdAndUpdate(req.params.id, {
      $set: { isActive: false },
    });
    return;
  }
  static async updateOrderStatus(req: any) {
    if (
      req.body.orderStatusTypeId &&
      req.body.orderId &&
      req.body.orderProductId
    ) {
      await OrderStatus.findByIdAndUpdate(req.body.id, {
        $set: {
          date: req.body.date,
          orderStatusTypeId: new mongoose.Types.ObjectId(
            req.body.orderStatusTypeId
          ),
          orderId: new mongoose.Types.ObjectId(req.body.orderId),
          orderProductId: new mongoose.Types.ObjectId(req.body.orderProductId),
        },
      });
      const data = await OrderStatus.findById(req.body.id).populate(
        "orderStatusTypeId"
      );
      return data;
    } else {
      throw new BadRequestError(
        "pls provide orderId and oderProductId in query params"
      );
    }
  }
  static async getOrderStatus(req: any) {
    const data = await OrderStatus.find().populate("orderStatusTypeId");
    return data;
  }
  static async getOrderStatusOrderId(req: any) {
    if (req.query.orderId && req.query.orderProductId) {
      const data = await OrderStatus.find({
        $and: [
          { orderId: new mongoose.Types.ObjectId(req.query.orderId) },
          {
            orderProductId: new mongoose.Types.ObjectId(
              req.query.orderProductId
            ),
          },
        ],
      }).populate("orderStatusTypeId");
      return data;
    } else {
      throw new BadRequestError(
        "pls provide orderId and oderProductId in query params"
      );
    }
  }
}
