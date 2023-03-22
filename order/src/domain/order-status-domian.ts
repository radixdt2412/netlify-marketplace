import { responseSuccess } from "@rx-marketplace/common";
import { Request, Response } from 'express';
import { OrderStatusDatabaseLayer } from "../database/order-status-database";


export class OrderStatusDomain {
   

    static async removeOrderStatus(req: Request, res: Response) {
        await OrderStatusDatabaseLayer.removeOrderStatus(req);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async updateOrderStatus(req: Request, res: Response) {
        const d = await OrderStatusDatabaseLayer.updateOrderStatus(req);
        res.send(responseSuccess({ result: d }));
    }

    static async getOrderStatus(req: Request, res: Response) {
        const OrderStatus = await OrderStatusDatabaseLayer.getOrderStatus(req);
        res.send(responseSuccess({ result: OrderStatus }));
    }

    static async getOrderStatusOrderId(req: Request, res: Response) {
        const OrderStatus = await OrderStatusDatabaseLayer.getOrderStatusOrderId(req);
        res.send(responseSuccess({ result: OrderStatus }));
    }
    
}