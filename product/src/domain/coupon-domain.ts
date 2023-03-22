import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CouponDatabaseLayer } from '../database/coupon-database';

export class CouponDomain {

    static async createCoupon(req: Request, res: Response) {
        const Coupon = await CouponDatabaseLayer.createCoupon(req);
        res.send(responseSuccess({result:Coupon}));
    }

    static async updateCoupon(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await CouponDatabaseLayer.updateCoupon(req,req.params.id);
        res.send(responseSuccess({result:data}));
    }

    static async deleteCoupon(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CouponDatabaseLayer.deleteCoupon(req,req.params.id);
        res.send(responseSuccess({result:{ deleted: true }}));
    }

    static async getCouponList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponList(req);
        res.send(responseSuccess({result:Coupon}));
    }

    static async getCouponActiveList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponActiveList(req);
        res.send(responseSuccess({result:Coupon}));
    }
    static async getCouponDeactiveList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponDeactiveList(req);
        res.send(responseSuccess({result:Coupon}));
    }
    
    static async getMyCoupon(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getMyCoupon(req);
        res.send(responseSuccess({result:Coupon}));
    }
}
