import { validateRequest,verifyCustomerToken, verifyToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { ProductReviewDomain } from '../domain/product-review-domain';
const router = express.Router();


// Product create
router.post('/api/product/review/create',verifyCustomerToken,validateRequest,ProductReviewDomain.createProductReview);

// delete Product
router.delete('/api/product/review/delete/:id',verifyCustomerToken,ProductReviewDomain.deleteProductReview);

// get all Product
router.get('/api/product/review/get',verifyCustomerToken,ProductReviewDomain.getProductReviewList);


export { router as ProductReviewRouter };
