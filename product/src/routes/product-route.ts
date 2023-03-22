import { validateRequest,verifyCustomerToken, verifyToken, verifyVendorToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { ProductDomain } from '../domain/product-domain';
import { ProductValidation } from '../validations/product-validation';

const router = express.Router();

// Product create

router.get('/api/product/search/:data',verifyToken,ProductDomain.serchData);

router.get('/api/product/variantdetail/:id',verifyToken,ProductDomain.getProductDataProductId);

router.get('/api/product/getproduct',verifyToken,ProductDomain.getProduct);
router.get('/api/product/getwith/variantproduct',verifyToken,ProductDomain.getProductWithVariant);
router.get('/api/product/get/variant/product',verifyToken,ProductDomain.getProductVariant);
router.get('/api/product/variant/check',verifyToken,ProductDomain.checkProductCombination);
router.get('/api/product/suggest/coupon/:id',verifyToken,ProductDomain.couponSuggestionBasedOnProduct);


router.post('/api/product/create',verifyVendorToken,ProductValidation.ProductCreateValidation,validateRequest,ProductDomain.createProduct);
router.post('/api/product/variant/create',ProductValidation.ProductVariantValidation,validateRequest,ProductDomain.createProductVariant);
router.put('/api/product/variant/update',ProductValidation.ProductVariantUpdateValidation,validateRequest,ProductDomain.updateProductVariant);
// Product update
router.put('/api/product/update/:id',verifyVendorToken,ProductDomain.updateProduct)
    
// delete Product
router.delete('/api/product/delete/:id',verifyVendorToken,ProductDomain.deleteProduct);

// get all Product
router.get('/api/product/get',verifyToken,ProductDomain.getProductList);

router.get('/api/product/getproduct/:id',verifyToken,ProductDomain.getProductDetails);
router.get('/api/product/getactive',verifyToken,ProductDomain.getActiveProductList);
router.get('/api/product/getdeactive',verifyToken,ProductDomain.getDeactiveProductList);

// get all Product based on businessId
router.get('/api/product/getproductsubcategory/:id',verifyToken,ProductDomain.getProductSubCategoryIdList);
router.get('/api/product/getproductwithaddonsandproductitem',ProductDomain.getProductWithAddOnsAndProductItem);

router.get('/api/product/getreviewbasedonproductid/:id',verifyToken,ProductDomain.reviewBasedOnProductId);

export { router as ProductRouter };
