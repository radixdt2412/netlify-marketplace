import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreWorkingDayDatabaseLayer } from '../database/store-working-day-database';

export class StoreWorkingDayDomain {

    static async createStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.body.storeId)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store = await StoreWorkingDayDatabaseLayer.createStoreWorkingDay(req);
        res.send(responseSuccess({ result: Store }));
    }

    static async updateStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.updateStoreWorkingDay(req, req.params.id);
        res.send(responseSuccess({ result: { updated: true } }));
    }

    static async deleteStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.deleteStoreWorkingDay(req, req.params.id);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async getStoreWorkingDayId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store = await StoreWorkingDayDatabaseLayer.getStoreWorkingDayById(req, req.params.id);
        res.send(responseSuccess({ result: Store }));
    }
}