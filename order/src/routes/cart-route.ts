import { validateRequest,verifyCustomerToken, verifyToken, verifyVendorToken } from '@rx-marketplace/common';
import express from 'express';
import { CartDomain } from '../domain/cart-domain';
import { CartValidation } from "../validations/cart-validation";

const router = express.Router();

// cart create
router.post('/api/order/cart/create',verifyCustomerToken,CartValidation.CartCreateValidation,validateRequest,CartDomain.createCart);

//cart delete
router.post('/api/order/cart/remove',verifyCustomerToken,CartDomain.removeCart);

//product remove
router.put('/api/order/cart/remove/product',verifyCustomerToken,CartDomain.removeProductCart);

// get all cart
router.get('/api/order/cart/get',verifyCustomerToken,CartDomain.getCart);

export { router as cartRouter };
