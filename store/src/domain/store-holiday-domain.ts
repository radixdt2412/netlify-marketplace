import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreHolidayDatabaseLayer } from '../database/store-holiday-database';

export class StoreHolidayDomain {

    static async createStoreHoliday(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.body.storeId)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store = await StoreHolidayDatabaseLayer.createStoreHoliday(req);
        res.send(responseSuccess({result:Store}));
    }

    static async updateStoreHoliday(req: Request, res: Response) {
     
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreHolidayDatabaseLayer.updateStoreHoliday(req,req.params.id);
        res.send(responseSuccess({result:{ updated: true }}));
    }

    static async deleteStoreHoliday(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreHolidayDatabaseLayer.deleteStoreHoliday(req,req.params.id);
        res.send(responseSuccess({result:{ deleted: true }}));
    }

    static async getStoreHolidayByStoreId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store =  await StoreHolidayDatabaseLayer.getStoreHolidayByStoreId(req,req.params.id);
        res.send(responseSuccess({result:Store}));
    }
    

}