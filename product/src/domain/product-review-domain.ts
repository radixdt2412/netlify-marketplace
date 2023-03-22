import { BadRequestError,responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductReviewDatabaseLayer } from '../database/product-review-database';

export class ProductReviewDomain {

    static async createProductReview(req: Request, res: Response) {       
        const ProductReview = await ProductReviewDatabaseLayer.createProductReview(req);
        res.send(responseSuccess({result:ProductReview}));

    }

    static async deleteProductReview(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductReviewDatabaseLayer.deleteProductReview(req.params.id);
        res.send(responseSuccess({result:{ deleted: true }}));
    }

    static async getProductReviewList(req: Request, res: Response) {
        const ProductReview = await ProductReviewDatabaseLayer.getProductReviewList(req);
        res.send(responseSuccess({result:ProductReview}));
    }

}