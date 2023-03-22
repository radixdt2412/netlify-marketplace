import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';
import express, { Request, Response, Router } from 'express';
import { CountryDomain } from '../domain/country-domain';
import { CountryValidation } from '../validation/county-validation';

const router = express.Router();

// Country create
router.post('/api/users/country/create',CountryValidation.CountryCreateValidation,verifyAdminToken,validateRequest,CountryDomain.createCountry);

// Country update
router.put('/api/users/country/update/:id',CountryValidation.CountryUpdateValidation,verifyAdminToken,validateRequest,CountryDomain.updateCountry)
 
// delete Country
router.delete('/api/users/country/delete/:id',verifyAdminToken,validateRequest,CountryDomain.deleteCountry);

//TODO :: middleware pending

// get all Country
router.get('/api/users/country/get',CountryDomain.getCountryList);
router.get('/api/users/country/getactive',CountryDomain.getCountryActiveList);
router.get('/api/users/country/getdeactive',CountryDomain.getCountryDeactiveList);
router.get('/api/users/country/getcountrybasedonname/:name',CountryDomain.getCountryNameBasedSerch);

export { router as countryRouter };
