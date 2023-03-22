import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CountryDatabaseLayer } from '../database/country-database';

export class CountryDomain {


    static async createCountry(req: Request, res: Response) {
        const country = await CountryDatabaseLayer.createCountry(req);
        res.send(responseSuccess({result:country}));
    }

    static async updateCountry(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CountryDatabaseLayer.updateCountry(req, req.params.id);
        res.send(responseSuccess());
    }

    static async deleteCountry(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CountryDatabaseLayer.deleteCountry(req.params.id);
        res.send(responseSuccess());
    }

    static async getCountryList(req: Request, res: Response) {
        const country = await CountryDatabaseLayer.getCountryList(req);
        res.send(responseSuccess({result:country}));
    }
    static async getCountryActiveList(req: Request, res: Response) {
        const country = await CountryDatabaseLayer.getCountryActiveList(req);
        res.send(responseSuccess({result:country}));
    }
    static async getCountryDeactiveList(req: Request, res: Response) {
        const country = await CountryDatabaseLayer.getCountryDeactiveList(req);
        res.send(responseSuccess({result:country}));
    }
    
    static async getCountryNameBasedSerch(req: Request, res: Response) {
        const country = await CountryDatabaseLayer.getCountryNameBasedSerch(req.params.name);
        res.send(responseSuccess({result:country}));
    }

}