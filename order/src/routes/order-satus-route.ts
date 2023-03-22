import { validateRequest,verifyCustomerToken, verifyToken, verifyVendorToken } from '@rx-marketplace/common';
import express from 'express';
import { OrderStatusDomain } from '../domain/order-status-domian';

const router = express.Router();

//OrderStatusType delete
router.post('/api/order/status/delete/:id',OrderStatusDomain.removeOrderStatus);

//product remove
router.put('/api/order/status/update',OrderStatusDomain.updateOrderStatus);

// get all OrderStatusType
router.get('/api/order/status/get',OrderStatusDomain.getOrderStatus);


router.get('/api/order/status/get/orderid',OrderStatusDomain.getOrderStatusOrderId);

export { router as OrderStatusRouter };
