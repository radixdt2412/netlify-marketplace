import { validateRequest,verifyCustomerToken, verifyToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { ProductWhishlistDomain } from '../domain/product-whislist-domain';
import { ProductWhislistValidation } from '../validations/product-whislist-validation';

const router = express.Router();


// Product create
router.post('/api/product/whislist/create',verifyCustomerToken,ProductWhislistValidation.ProductWhislistCreateValidation,validateRequest,ProductWhishlistDomain.createProductWhishlist);

// delete Product
router.delete('/api/product/whislist/delete/:id',verifyCustomerToken,ProductWhishlistDomain.deleteProductWhishlist);

// get all Product
router.get('/api/product/whislist/get',verifyCustomerToken,ProductWhishlistDomain.getProductWhishlistList);


export { router as ProductWhishlistRouter };
