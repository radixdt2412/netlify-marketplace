import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AddOnsDatabaseLayer } from '../database/add-ons-database';

export class AddOnsDomain {

    static async createAddOns(req: Request, res: Response) {
        const AddOns = await AddOnsDatabaseLayer.createAddOns(req);
        res.send(responseSuccess({ result: AddOns }));
    }

    static async updateAddOns(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await AddOnsDatabaseLayer.updateAddOns(req, req.params.id);
        res.send(responseSuccess({ result: data }));
    }

    static async deleteAddOns(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await AddOnsDatabaseLayer.deleteAddOns(req, req.params.id);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async getAddOnsList(req: Request, res: Response) {
        const AddOns = await AddOnsDatabaseLayer.getAddOnsList(req);
        res.send(responseSuccess({ result: AddOns }));
    }

    static async getAddOnsListProductId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const AddOns = await AddOnsDatabaseLayer.getAddOnsListProductId(req, req.params.id);
        res.send(responseSuccess({ result: AddOns }));
    }

}