import { responseSuccess } from "@rx-marketplace/common";
import { Request, Response } from 'express';
import { OrderStatusTypeDatabaseLayer } from "../database/order-status-type-database";

export class OrderStatusTypeDomain {
    static async createOrderStatusType(req: Request, res: Response) {
        const OrderStatusType = await OrderStatusTypeDatabaseLayer.createOrderStatusType(req);
        res.send(responseSuccess({ result: OrderStatusType }));
    }

    static async removeOrderStatusType(req: Request, res: Response) {
        await OrderStatusTypeDatabaseLayer.removeOrderStatusType(req);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async updateOrderStatusType(req: Request, res: Response) {
        const d = await OrderStatusTypeDatabaseLayer.updateOrderStatusType(req);
        res.send(responseSuccess({ result: d }));
    }

    static async getOrderStatusType(req: Request, res: Response) {
        const OrderStatusType = await OrderStatusTypeDatabaseLayer.getOrderStatusType(req);
        res.send(responseSuccess({ result: OrderStatusType }));
    }
}