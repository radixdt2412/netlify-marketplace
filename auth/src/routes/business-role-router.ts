import express, { Request, Response, Router } from 'express';
import { BusinessRoleDomain } from '../domain/business-role-domain';

const router = express.Router();

//TODO :: middleware pending

router.post('/api/users/businessrole/create',BusinessRoleDomain.createBusinessRole);

router.put('/api/users/businessrole/update/:id',BusinessRoleDomain.updateBusinessRole)
 
router.delete('/api/users/businessrole/delete/:id',BusinessRoleDomain.deleteBusinessRole);

router.get('/api/users/businessrole/get',BusinessRoleDomain.getBusinessRoleList);

export { router as BusinessRoleRouter };