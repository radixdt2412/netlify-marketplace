import { validateRequest,verifyAdminToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { ProductSubCategoryDomain } from '../domain/product-sub-category-domain';
import { ProductSubCategoryValidation } from '../validations/product-sub-category-validation';

const router = express.Router();

// ProductSubCategory create
router.post('/api/product/productsubcategory/create',ProductSubCategoryValidation.ProductSubCategoryCreateValidation,verifyAdminToken,validateRequest,ProductSubCategoryDomain.createProductSubCategory);

// ProductSubCategory update
router.put('/api/product/productsubcategory/update/:id',ProductSubCategoryValidation.ProductSubCategoryUpdateValidation,verifyAdminToken,validateRequest,ProductSubCategoryDomain.updateProductSubCategory)
 
// delete ProductSubCategory
router.put('/api/product/productsubcategory/delete/:id',verifyAdminToken,ProductSubCategoryDomain.deleteProductSubCategory);

// get all ProductSubCategory
router.get('/api/product/productsubcategory/get',ProductSubCategoryDomain.getProductSubCategoryList);
// get all ProductSubCategory
router.get('/api/product/productsubcategory/getid/:id',ProductSubCategoryDomain.getProductSubCategoryId);

// get active businessSubCategoryList with active status code
router.get('/api/product/productsubcategory/getactive',ProductSubCategoryDomain.getProductSubCategoryActiveList);

// get all ProductSubCategory based on businessCategoryId
router.get('/api/product/productsubcategory/getbusinesssubcategoryid/:id',ProductSubCategoryDomain.getProductCategoryIdList);


export { router as ProductSubCategoryRouter };
