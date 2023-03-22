import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CustomerAddressDatabaseLayer } from '../database/customer-address-database';

export class CustomerAddressDomain {
    static async createAddress(req: Request, res: Response) {
        const address = await CustomerAddressDatabaseLayer.createAddress(req);
        res.send(responseSuccess({result:address}));
    }

    static async updateAddress(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CustomerAddressDatabaseLayer.updateAddress(req,req.params.id);
        res.send(responseSuccess());
    }

    static async deleteAddress(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CustomerAddressDatabaseLayer.deleteAddress(req.params.id);
        res.send(responseSuccess());
    }

    static async getCurrentUserAddress(req: Request, res: Response) {
        const address =  await CustomerAddressDatabaseLayer.getCurrentUserAddress(req);
        res.send(responseSuccess({result:address}));
    }

}