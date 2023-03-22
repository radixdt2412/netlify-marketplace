import { BadRequestError, responseSuccess } from "@rx-marketplace/common";
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessRoleDatabaseLayer } from '../database/business-role-database';

export class BusinessRoleDomain {

    static async createBusinessRole(req: Request, res: Response) {
        const BusinessRole = await BusinessRoleDatabaseLayer.createBusinessRole(req);
        res.send(responseSuccess({result:BusinessRole}));
    }

    static async updateBusinessRole(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessRoleDatabaseLayer.updateBusinessRole(req,req.params.id);
        res.send(responseSuccess());
    }

    static async deleteBusinessRole(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessRoleDatabaseLayer.deleteBusinessRole(req.params.id);
        res.send(responseSuccess());
    }

    static async getBusinessRoleList(req: Request, res: Response) {
        const BusinessRole =  await BusinessRoleDatabaseLayer.getBusinessRoleList(req);
        res.send(responseSuccess());
    }

    

}