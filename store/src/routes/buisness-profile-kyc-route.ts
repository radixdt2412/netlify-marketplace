import express, { Request, Response, Router } from 'express';
import { BusinessProfileKycDomain } from '../domain/business-profile-kyc-domain';
import { verifyAdminToken, verifyVendorToken } from '@rx-marketplace/common';
const FirebaseStorage = require('multer-firebase-storage')

import * as admin from "firebase-admin";
import credential from "../marketplace-5438b-firebase-adminsdk-i4wql-92b99d4176.json"
import multer from 'multer';
import { BusinessProfileKYCValidation } from '../validations/business-profile-kyc-validation';

const router = express.Router();

//TODO multer common function pending

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(JSON.stringify(credential))),
    storageBucket: "gs://marketplace-5438b.appspot.com"
  });
  
const uploadMulter = multer({
    storage: FirebaseStorage({
      bucketName: "gs://marketplace-5438b.appspot.com",
      credentials: credential,
      public:true,
    },admin)
}).single('file')

// BusinessProfileKyc create
router.post('/api/store/imageupload',uploadMulter,BusinessProfileKycDomain.imageUpload);
router.post('/api/store/businessprofilekyc/create',BusinessProfileKYCValidation.BusinessProfileKYCCreateValidation,verifyVendorToken,BusinessProfileKycDomain.createBusinessProfileKyc);

// BusinessProfileKyc update
router.put('/api/store/businessprofilekyc/update/:id',verifyAdminToken,BusinessProfileKycDomain.updateBusinessProfileKyc)

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/get',verifyAdminToken,BusinessProfileKycDomain.getBusinessProfileKycList);

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/getpending',verifyAdminToken,BusinessProfileKycDomain.getBusinessProfileKycPendingList);
 
// get all BusinessProfileIdBasedKyc
router.get('/api/store/businessprofilekyc/getbybusinessprofileid/:id',verifyVendorToken,BusinessProfileKycDomain.getBusinessProfileIdKycList);


export { router as BusinessProfileKycRouter };
