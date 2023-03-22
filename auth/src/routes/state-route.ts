import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { StateDomain } from '../domain/state-domain';
import { StateValidation } from "../validation/state-validation";

const router = express.Router();

//ADMIN Middleware check pending

// Country create
router.post('/api/users/state/create', StateValidation.StateCreateValidation, verifyAdminToken,validateRequest,StateDomain.createState);

// Country update
router.put('/api/users/state/update/:id',StateValidation.StateUpdateValidation,verifyAdminToken,validateRequest, StateDomain.updateState)

// delete Country
router.delete('/api/users/state/delete/:id',verifyAdminToken,validateRequest, StateDomain.deleteState);

//TODO :: middleware pending

// get all Country
router.get('/api/users/state/get', StateDomain.getStateList);
router.get('/api/users/state/getdeactive', StateDomain.getStateDeactiveList);
router.get('/api/users/state/getactive', StateDomain.getStateActiveList);
router.get('/api/users/state/getstatebasedonname/:name', StateDomain.getStateNameBasedSerch);

//get State based on stateId
router.get('/api/users/state/getcountrybase/:id', StateDomain.getStateCountryId);
export { router as stateRouter };
