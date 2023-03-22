import express, { Request, Response, Router } from 'express';
import { AttributeValueDomain } from '../domain/attribute-value';
import { verifyAdminToken, verifyToken } from '@rx-marketplace/common';


const router = express.Router();

// Attribute create
router.post('/api/product/attributevalue/create',verifyAdminToken,AttributeValueDomain.createAttributeValue);

// Attribute update
router.put('/api/product/attributevalue/update/:id',verifyAdminToken,AttributeValueDomain.updateAttributeValue)
 
// delete Attribute
router.delete('/api/product/attributevalue/delete/:id',verifyAdminToken,AttributeValueDomain.deleteAttributeValue);

// get all Attribute
router.get('/api/product/attributevalue/get',AttributeValueDomain.getAttributeValueList);

export { router as AttributeValueRouter };
