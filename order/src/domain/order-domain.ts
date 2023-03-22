import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderDatabaseLayer } from '../database/order-database';

export class OrderDomain {

    static async createOrder(req: Request, res: Response) {
        const Order = await OrderDatabaseLayer.createOrderBasedOnCart(req);
        res.send(responseSuccess({result:Order}));
    }

    static async productOrder(req: Request, res: Response) {
        const Order = await OrderDatabaseLayer.productOrder(req);
        res.send(responseSuccess({result:Order}));
    }


    static async getSignleOrder(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
          }
        const data=await OrderDatabaseLayer.getSignleOrder(req,req.params.id);
        res.send(responseSuccess({result:data}));
    }

    static async getOrder(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.getOrder(req);
        res.send(responseSuccess({result:Order}));
    }
    
    static async revenue(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.revenue(req);
        res.send(responseSuccess({result:Order}));
    }
    
    static async totalOrderFromEachBusinessCategory(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalOrderFromEachBusinessCategory(req);
        res.send(responseSuccess({result:Order}));
    }

    
    static async totalRevnueFromEachBusinessCategory(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalRevnueFromEachBusinessCategory(req);
        res.send(responseSuccess({result:Order}));
    }
    
    static async totalSaleBusinessUserBased(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalSaleBusinessUserBased(req,req.params.id);
        res.send(responseSuccess({result:Order}));
    }
    
    static async totalCustomerBasedBusinessUser(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalCustomerBasedBusinessUser(req,req.params.id);
        res.send(responseSuccess({result:Order}));
    }
    static async couponSuggestion(req: Request, res: Response) {
        const Cart =  await OrderDatabaseLayer.couponSuggestion(req,req.params.id);
        res.send(responseSuccess({result:Cart}));
    }
    
    static async applyCoupon(req: Request, res: Response) {
        const Cart =  await OrderDatabaseLayer.applyCoupon(req);
        res.send(responseSuccess({result:Cart}));
    }

    static async userDashboard(req:Request,res:Response){
        const Cart =  await OrderDatabaseLayer.userDashboard(req);
        res.send(responseSuccess({result:Cart}));
    }

}