import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { CouponDomain } from '../domain/coupon-domain';
import { verifyCustomerToken, verifyToken } from '@rx-marketplace/common';
import { CouponValidation } from '../validations/coupon-validation';


const router = express.Router();

//ADMIN Middleware check pending

// Coupon create
router.post('/api/product/coupon/create',verifyAdminToken,CouponValidation.CouponCreateValidation,validateRequest,CouponDomain.createCoupon);

// Coupon update
router.put('/api/product/coupon/update/:id',verifyAdminToken,CouponDomain.updateCoupon)
 
// delete Coupon
router.delete('/api/product/coupon/delete/:id',verifyAdminToken,CouponDomain.deleteCoupon);

// get all Coupon
router.get('/api/product/coupon/get',CouponDomain.getCouponList);
router.get('/api/product/coupon/getactive',CouponDomain.getCouponActiveList);
router.get('/api/product/coupon/getdeactive',CouponDomain.getCouponDeactiveList);

router.get('/api/product/my/coupon',verifyCustomerToken,CouponDomain.getMyCoupon);

export { router as CouponRouter };
