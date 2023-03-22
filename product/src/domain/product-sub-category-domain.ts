import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductSubCategoryDatabaseLayer } from '../database/product-sub-category-database';

export class ProductSubCategoryDomain {

    static async createProductSubCategory(req: Request, res: Response) {
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true || permission.isSuperAdmin == true) {
            const ProductSubCategory = await ProductSubCategoryDatabaseLayer.createProductSubCategory(req);
            res.send(responseSuccess({ result: ProductSubCategory }));
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async updateProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true || permission.isSuperAdmin == true) {
            const data = await ProductSubCategoryDatabaseLayer.updateProductSubCategory(req, req.params.id);
            res.send(responseSuccess({ result: { updated: true } }));
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async deleteProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true || permission.isSuperAdmin == true) {
            await ProductSubCategoryDatabaseLayer.deleteProductSubCategory(req.params.id);
            res.send(responseSuccess({ result: { deleted: true } }));
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async getProductSubCategoryList(req: Request, res: Response) {
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryList(req);
        res.send(responseSuccess({ result: ProductSubCategory }));
    }

    static async getProductSubCategoryId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryId(req, req.params.id);
        res.send(responseSuccess({ result: ProductSubCategory }));
    }
    static async getProductCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductCategoryIdList(req, req.params.id);
        res.send(responseSuccess({ result: ProductSubCategory }));
    }
    static async getProductSubCategoryActiveList(req: Request, res: Response) {
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryActiveList(req);
        res.send(responseSuccess({ result: ProductSubCategory }));
    }

}