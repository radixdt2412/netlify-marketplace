import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductDatabaseLayer } from '../database/product-database';

export class ProductDomain {

    static async createProduct(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.createProduct(req);
        res.send(responseSuccess({ result: Product }));
    }
    

    static async updateProductVariant(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.updateProductVariant(req, req.params.id);
        res.send(responseSuccess({ result: Product }));
    }
    
    static async createProductVariant(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.createProductVariant(req, req.params.id);
        res.send(responseSuccess({ result: Product }));
    }

    static async updateProduct(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await ProductDatabaseLayer.updateProduct(req, req.params.id);
        res.send(responseSuccess({ result: data }));
    }

    static async deleteProduct(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductDatabaseLayer.deleteProduct(req, req.params.id);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async getProductList(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProductList(req);
        res.send(responseSuccess({ result: Product.result, total: Product.total, page: Product.page }));
    }

    static async getActiveProductList(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getActiveProductList();
        res.send(responseSuccess({ result: Product }));
    }

    static async getDeactiveProductList(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getDeactiveProductList();
        res.send(responseSuccess({ result: Product }));
    }

    static async getProductSubCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Product = await ProductDatabaseLayer.getProductCategoryIdList(req, req.params.id);
        res.send(responseSuccess({ result: Product }));
    }

    static async getProductWithAddOnsAndProductItem(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProductWithAddOnsAndProductItem(req);
        res.send(responseSuccess({ result: Product }));
    }

    static async getProductDetails(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProductDetails(req, req.params.id);
        res.send(responseSuccess({ result: Product }));
    }

    static async serchData(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.serchData(req);
        res.send(responseSuccess({ result: Product }));
    }

    static async reviewBasedOnProductId(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.reviewBasedOnProductId(req.params.id);
        res.send(responseSuccess({ result: Product.result }));
    }

    static async getProduct(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProduct(req);
        res.send(responseSuccess({ result: Product }));
    }
    static async getProductDataProductId(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProductDataProductId(req);
        res.send(responseSuccess({ result: Product }));
    }
    

    static async getProductWithVariant(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.getProductWithVariant(req);
        res.send(responseSuccess({ result: Product }));
    }

    static async getProductVariant(req: Request, res: Response) {
        if (req.query.productItemId != null && req.query.productItemId != undefined) {
            if (!mongoose.isValidObjectId(req.query.productItemId)) {
                throw new BadRequestError('Requested id is not id type');
            }
        }
        if (req.query.productId != null && req.query.productId != undefined) {
            if (!mongoose.isValidObjectId(req.query.productId)) {
                throw new BadRequestError('Requested id is not id type');
            }
        }

        const Product = await ProductDatabaseLayer.getProductVariant(req, req.query.productItemId, req.query.productId);
        res.send(responseSuccess({ result: Product }));
    }

    static async checkProductCombination(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.checkProductCombination(req,);
        res.send(responseSuccess({ result: Product }));
    }

    static async couponSuggestionBasedOnProduct(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.couponSuggestionBasedOnProduct(req, req.params.id);
        res.send(responseSuccess({ result: Product }));
    }
}
