import { validateRequest,verifyAdminToken,verifyToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { ProductItemDomain } from '../domain/product-item-domain';
import { ProductItemValidation } from '../validations/product-item-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/productitem/create',verifyAdminToken,ProductItemValidation.ProductItemCreateValidation,validateRequest,ProductItemDomain.createProductItem);

// Product update
router.put('/api/product/productitem/update/:id',verifyAdminToken,ProductItemDomain.updateProductItem)
 
// delete Product
router.delete('/api/product/productitem/delete/:id',verifyAdminToken,ProductItemDomain.deleteProductItem);

// get all Product
router.get('/api/product/productitem/get',ProductItemDomain.getProductItemList);

//get product item list based on productId
router.get('/api/product/productitem/getproduct/:id',ProductItemDomain.getProductItemListProductId);


export { router as ProductItemRouter };
