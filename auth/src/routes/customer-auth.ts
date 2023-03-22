import express, { Request, Response, Router } from 'express';
import { validateRequest, verifyAdminToken, verifyCustomerToken } from "@rx-marketplace/common";
import { CustomerDomain } from '../domain/customer-auth-domain';
import { CustomerAuthValidation } from '../validation/customer-auth-validation';

const router = express.Router();

// SIGN-UP
router.post('/api/users/customer/signup',CustomerAuthValidation.SignupValidation,validateRequest,CustomerDomain.signUp);

// SIGN-IN
router.post('/api/users/customer/signin',CustomerAuthValidation.signInValidation,validateRequest,CustomerDomain.signIn);
  
//All User List
router.get('/api/users/customer/getallusers', CustomerDomain.getAllUsers);

//Single User Detail
router.get('/api/users/customer/getuserbyid/:id', CustomerDomain.getUserById);

//Delete Single User
router.get('/api/users/customer/delete',verifyCustomerToken,CustomerDomain.deleteUserById);

//User by name
router.get('/api/users/customer/getuserbyname/:name',CustomerDomain.getUserByName)

//User persnol info update
router.put('/api/users/customer/updateuser',CustomerAuthValidation.updateUser,validateRequest,verifyCustomerToken,CustomerDomain.updateUserInfo)
 
// CURRENT_USER
router.get('/api/users/customer/currentuser', verifyCustomerToken,CustomerDomain.currentLoginUser);

//verify email code
router.post('/api/users/customer/mailverifycode',verifyCustomerToken,CustomerDomain.emailCodeVerification);

//forgot password mail trigger
router.post('/api/users/customer/forgotpassword/mailtrigger',CustomerAuthValidation.forgotPasswordMailTrigger,validateRequest,CustomerDomain.forgotPasswordMailTrigger);

//forgot password with code verify
router.post('/api/users/customer/forgotpassword/codeverify',CustomerAuthValidation.forgotPasswordCodeVerify,validateRequest,CustomerDomain.forgotPasswordCodeVerification);
// SIGN-OUT
router.post('/api/users/signout',verifyCustomerToken,CustomerDomain.signOut);

//invite switch update
router.get('/api/users/customer/setinvitecode/:status',verifyAdminToken,CustomerDomain.inviteOnlyGenralSwitch );

//invite switch get 
router.get('/api/users/customer/getinvitecode',CustomerDomain.getInviteOnlyGenralSwitch );

export { router as customerRouter };
