import express from 'express';
import { StoreWorkingDayDomain } from '../domain/store-working-day-domain';
import { verifyToken, verifyVendorToken,validateRequest } from '@rx-marketplace/common';
import { StoreWorkingDayValidation } from '../validations/store-working-day-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/storeworkingday/create',verifyVendorToken,StoreWorkingDayValidation.StoreWorkingDayCreateValidation,validateRequest,StoreWorkingDayDomain.createStoreWorkingDay);

// Store update
router.put('/api/store/storeworkingday/update/:id',verifyVendorToken,StoreWorkingDayValidation.StoreWorkingDayUpdateValidation,validateRequest,StoreWorkingDayDomain.updateStoreWorkingDay)
 
// delete Store
router.delete('/api/store/storeworkingday/delete/:id',verifyVendorToken,StoreWorkingDayDomain.deleteStoreWorkingDay);

// get all Store
router.get('/api/store/storeworkingday/get/:id',verifyVendorToken,StoreWorkingDayDomain.getStoreWorkingDayId);



export { router as StoreWorkingDayRouter };
