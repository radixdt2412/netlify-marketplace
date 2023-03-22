import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessProfileKycDatabaseLayer } from '../database/business-profile-kyc-database';


export class BusinessProfileKycDomain {

    static async imageUpload(req:Request,res:Response){
        console.log('hii');
        
        if (req.file) {
            const data = JSON.parse(JSON.stringify(req.file));
            if (data) {
                console.log('data',data.publicUrl);
                res.send(responseSuccess({result:{imgeUrl:data.publicUrl}}));
            }
            
            
        } else {
            throw new BadRequestError("pls first upload document");
        }
    }


    static async createBusinessProfileKyc(req: Request, res: Response) {
        if (req.file) {
            const data = JSON.parse(JSON.stringify(req.file));
            if (data) {
                console.log(data.publicUrl);
            }
            const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.createBusinessProfileKyc(req, data.publicUrl);
            res.send(responseSuccess({result:BusinessProfileKyc}));
        } else {
            throw new BadRequestError("pls first upload document");
        }
    }

    static async updateBusinessProfileKyc(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessProfileKycDatabaseLayer.updateBusinessProfileKyc(req, req.params.id);
        res.send(responseSuccess({result:{ updated: true }}));
    }

    // static async deleteBusinessProfileKyc(req: Request, res: Response) {
    //     if (!mongoose.isValidObjectId(req.params.id)) {
    //         throw new BadRequestError('Requested id is not id type');
    //     }
    //     await BusinessProfileKycDatabaseLayer.deleteBusinessProfileKyc(req.params.id);
    //     res.send({ deleted: true });
    // }

    static async getBusinessProfileKycList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileKycList(req);
        res.send(responseSuccess({result:BusinessProfileKyc}));
    }

    static async getBusinessProfileIdKycList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileIdKycList(req, req.params.id);
        res.send(responseSuccess({result:BusinessProfileKyc}));
    }


    static async getBusinessProfileKycPendingList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileKycPendingList(req);
        res.send(responseSuccess({result:BusinessProfileKyc}));
    }
}

