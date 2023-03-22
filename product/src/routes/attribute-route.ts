import express, { Request, Response, Router } from 'express';
import { AttributeDomain } from '../domain/attribute-domain';
import { verifyAdminToken, verifyToken } from '@rx-marketplace/common';

const router = express.Router();


// Attribute create
router.post('/api/product/attribute/create',verifyAdminToken,AttributeDomain.createAttribute);

// Attribute update
router.put('/api/product/attribute/update/:id',verifyAdminToken,AttributeDomain.updateAttribute)
 
// delete Attribute
router.delete('/api/product/attribute/delete/:id',verifyAdminToken,AttributeDomain.deleteAttribute);

// get all Attribute
router.get('/api/product/attribute/get',AttributeDomain.getAttributeList);

export { router as AttributeRouter };
