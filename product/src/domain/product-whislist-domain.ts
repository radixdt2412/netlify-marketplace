import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductWhishlistDatabaseLayer } from '../database/product-whislist-database';

export class ProductWhishlistDomain {

    static async createProductWhishlist(req: Request, res: Response) {
        const ProductWhishlist = await ProductWhishlistDatabaseLayer.createProductWhishlist(req);
        res.send(responseSuccess({ result: ProductWhishlist }));
    }

    static async deleteProductWhishlist(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductWhishlistDatabaseLayer.deleteProductWhishlist(req.params.id,req);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async getProductWhishlistList(req: Request, res: Response) {
        const ProductWhishlist = await ProductWhishlistDatabaseLayer.getProductWhishlistList(req);
        res.send(responseSuccess({ result: ProductWhishlist }));
    }

}