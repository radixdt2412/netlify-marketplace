import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessSubCategoryDatabaseLayer } from '../database/business-sub-category-database';

export class BusinessSubCategoryDomain {

    static async createBusinessSubCategory(req: Request, res: Response) {

        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true || permission.isSuperAdmin == true) {
            const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.createBusinessSubCategory(req);
            res.send(responseSuccess({ result: BusinessSubCategory }));
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async updateBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true || permission.isSuperAdmin == true) {
            await BusinessSubCategoryDatabaseLayer.updateBusinessSubCategory(req, req.params.id);
            res.send(responseSuccess({ result: { updation: true } }));
        } else {
            throw new BadRequestError('You don\'t have rights to update category');
        }
    }

    static async deleteBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true || permission.isSuperAdmin == true) {
            await BusinessSubCategoryDatabaseLayer.deleteBusinessSubCategory(req.params.id);
            res.send(responseSuccess({ result: { deleted: true } }));
        } else {
            throw new BadRequestError('You don\'t have rights to delete category');
        }

    }

    static async getBusinessSubCategoryList(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryList(req);
        res.send(responseSuccess({ result: BusinessSubCategory }));
    }

    static async getBusinessSubCategoryId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryId(req, req.params.id);
        res.send(responseSuccess({ result: BusinessSubCategory }));
    }

    static async getBusinessSubCategoryActiveList(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryActiveList(req);
        res.send(responseSuccess({ result: BusinessSubCategory }));
    }

    static async getBusinessCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessCategoryIdList(req, req.params.id);
        res.send(responseSuccess({ result: { BusinessSubCategory } }));
    }

}

