import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StateDatabaseLayer } from '../database/state-database';

export class StateDomain {

    static async createState(req: Request, res: Response) {
        const State = await StateDatabaseLayer.createState(req);
        res.send(responseSuccess({result:State}));
    }

    static async updateState(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StateDatabaseLayer.updateState(req,req.params.id);
        res.send(responseSuccess({result:{ updated: true }}));
    }

    static async deleteState(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StateDatabaseLayer.deleteState(req.params.id);
        res.send(responseSuccess({result:{ deleted: true }}));
    }

    static async getStateList(req: Request, res: Response) {
        const State =  await StateDatabaseLayer.getStateList(req);
        res.send(responseSuccess({result:State}));
    }
    static async getStateDeactiveList(req: Request, res: Response) {
        const State =  await StateDatabaseLayer.getStateDeactiveList(req);
        res.send(responseSuccess({result:State}));
    }
    static async getStateActiveList(req: Request, res: Response) {
        const State =  await StateDatabaseLayer.getStateActiveList(req);
        res.send(responseSuccess({result:State}));
    }
    static async getStateNameBasedSerch(req: Request, res: Response) {
        const State =  await StateDatabaseLayer.getStateNameBasedSerch(req.params.name);
        res.send(responseSuccess({result:State}));
    }
    
    static async getStateCountryId(req: Request,res:Response){
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const State =  await StateDatabaseLayer.getStateCountryId(req,req.params.id);
        res.send(responseSuccess({result:State}));
    }

}