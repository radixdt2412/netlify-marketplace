import { validateRequest,verifyToken, verifyVendorToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { AddOnsDomain } from '../domain/add-ons-domain';
import { AddOnsValidation } from '../validations/add-ons-validation';

const router = express.Router();

// Product create
router.post('/api/product/addons/create',verifyVendorToken,AddOnsValidation.AddOnsCreateValidation,validateRequest,AddOnsDomain.createAddOns);

// Product update
router.put('/api/product/addons/update/:id',verifyVendorToken,AddOnsDomain.updateAddOns)
 
// delete Product
router.delete('/api/product/addons/delete/:id',verifyVendorToken,AddOnsDomain.deleteAddOns);

// get all Product
router.get('/api/product/addons/get',AddOnsDomain.getAddOnsList);

//get product item list based on productId
router.get('/api/product/addons/getproduct/:id',AddOnsDomain.getAddOnsListProductId);


export { router as AddOnsRouter };
