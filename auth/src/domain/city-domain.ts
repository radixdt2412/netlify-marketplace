import { BadRequestError, responseSuccess } from "@rx-marketplace/common";
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CityDatabaseLayer } from '../database/city-database';

export class CityDomain {

    static async createCity(req: Request, res: Response) {
        const city = await CityDatabaseLayer.createCity(req);
        res.send(responseSuccess({result:city}));
    }

    static async updateCity(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CityDatabaseLayer.updateCity(req, req.params.id);
        
        res.send(responseSuccess());
    }

    static async deleteCity(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CityDatabaseLayer.deleteCity(req.params.id);
        res.send(responseSuccess());
    }

    static async getCityList(req: Request, res: Response) {
        const city = await CityDatabaseLayer.getCityList(req);
        res.send(responseSuccess({result:city}));
    }
    
    static async getCityDeactiveList(req: Request, res: Response) {
        const city = await CityDatabaseLayer.getCityDeactiveList(req);
        res.send(responseSuccess({result:city}));
    }

    static async getCityActiveList(req: Request, res: Response) {
        const city = await CityDatabaseLayer.getCityActiveList(req);
        res.send(responseSuccess({result:city}));
    }
    static async getCityStateId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const city = await CityDatabaseLayer.getCityStateId(req, req.params.id);
        res.send(responseSuccess({result:city}));
    }

    static async getCityNameBasedSerch(req: Request, res: Response) {
        const city = await CityDatabaseLayer.getCityNameBasedSerch(req.params.name);
        res.send(responseSuccess({result:city}));
    }

}