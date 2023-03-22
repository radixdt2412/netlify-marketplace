import { validateRequest,verifyCustomerToken, verifyToken, verifyVendorToken } from '@rx-marketplace/common';
import express from 'express';
import { OrderStatusTypeDomain } from '../domain/order-status-type-domian';

const router = express.Router();

// OrderStatusType create
router.post('/api/order/type/create',OrderStatusTypeDomain.createOrderStatusType);

//OrderStatusType delete
router.post('/api/order/type/delete/:id',OrderStatusTypeDomain.removeOrderStatusType);

//product remove
router.put('/api/order/type/update',OrderStatusTypeDomain.updateOrderStatusType);

// get all OrderStatusType
router.get('/api/order/type/get',OrderStatusTypeDomain.getOrderStatusType);

export { router as OrderStatusTypeRouter };
