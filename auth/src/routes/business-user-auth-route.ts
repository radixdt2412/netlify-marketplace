import express, { Request, Response, Router } from 'express';
import { validateRequest, verifyAdminToken, verifyToken, verifyVendorToken } from "@rx-marketplace/common"
import { BusinessUserAuthValidation } from "../validation/business-user-auth-validation";
import { BusinessDomain } from '../domain/business-user-auth-domain';
const router = express.Router();

// SIGN-UP
router.post('/api/users/businessuser/signup',BusinessUserAuthValidation.SignupValidation,validateRequest,BusinessDomain.signUp);

// SIGN-IN
router.post('/api/users/businessuser/signin',BusinessUserAuthValidation.signInValidation,validateRequest,BusinessDomain.signIn);

//Delete Single User
router.put('/api/users/businessuser/delete/:id',verifyAdminToken,validateRequest, BusinessDomain.deleteUserById);

// CURRENT_USER
router.get('/api/users/businessuser/currentuser', verifyVendorToken,validateRequest,BusinessDomain.currentLoginUser);

// SIGN-OUT
router.post('/api/users/signout',verifyVendorToken, BusinessDomain.signOut);

//MailTrigger for emailVerification MFA
router.get('/api/users/businessuser/mailverifytrigger',verifyVendorToken,validateRequest,BusinessDomain.emailVerification);

//verify email code
router.post('/api/users/businessuser/mailverifycode',verifyVendorToken,validateRequest,BusinessDomain.emailCodeVerification);

//add user
router.post('/api/users/businessuser/adduser',verifyVendorToken,validateRequest,BusinessDomain.createUser);

//forgot password mail trigger
router.get('/api/users/businessuser/forgotpassword/mailtrigger',BusinessDomain.forgotPasswordMailTrigger);

//forgot password with code verify
router.post('/api/users/businessuser/forgotpassword/codeverify',BusinessDomain.forgotPasswordCodeVerification);

//TODO :: middle ware pending

//All User List
router.get('/api/users/businessuser/getallusers', BusinessDomain.getAllUsers);
router.get('/api/users/businessuser/getallactiveusers', BusinessDomain.getAllActiveUsers);
router.get('/api/users/businessuser/getalldeactiveusers', BusinessDomain.getAllDeActiveUsers);

//Single User Detail
router.get('/api/users/businessuser/getuserbyid/:id', BusinessDomain.getUserById);

//User by name
router.get('/api/users/businessuser/getuserbyname/:name',BusinessDomain.getUserByName);

//getuser and thier roles
router.get('/api/users/businessuser/getuserrole/:id',BusinessDomain.userGetWithThirRoles);

//get user roles based on id 
router.get('/api/users/businessuser/role/:id',BusinessDomain.roleMapping);

export { router as BusinessUserRouter };
