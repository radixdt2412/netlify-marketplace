import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { CityDomain } from '../domain/city-domain';
import { CityValidation } from '../validation/city-validation';

const router = express.Router();

//ADMIN Middleware check pending

// city create
router.post('/api/users/city/create',CityValidation.CityCreateValidation,verifyAdminToken,validateRequest,CityDomain.createCity);

// city update
router.put('/api/users/city/update/:id',CityValidation.CityUpdateValidation,verifyAdminToken,validateRequest,CityDomain.updateCity)
 
// delete city
router.delete('/api/users/city/delete/:id',verifyAdminToken,validateRequest,CityDomain.deleteCity);

//TODO :: middleware pending

// get all city
router.get('/api/users/city/get',CityDomain.getCityList);
router.get('/api/users/city/getactive',CityDomain.getCityActiveList);
router.get('/api/users/city/getdeactive',CityDomain.getCityDeactiveList);

//get city based on name
router.get('/api/users/city/getbasedonname/:name',CityDomain.getCityNameBasedSerch);

//get city based on stateId
router.get('/api/users/city/getstatebase/:id',CityDomain.getCityStateId);

export { router as cityRouter };
