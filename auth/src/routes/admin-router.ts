import express, { Request, Response, Router } from 'express';
import { AuthDomain } from '../domain/admin-auth-domain';
import { Validation } from '../validation/admin-validation';
import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';

const router = express.Router();

router.post('/api/users/admin/permission',Validation.addRoleValidation,verifyAdminToken,validateRequest,AuthDomain.addPermissions)

router.post('/api/users/admin/rolecreate',verifyAdminToken,AuthDomain.addRole)

// SIGN-IN
router.post('/api/users/admin/login', Validation.signInValidation, validateRequest, AuthDomain.signIn);

//add user
router.post('/api/users/admin/addadmin', Validation.addAdminValidation, verifyAdminToken, validateRequest, AuthDomain.addAdmin);

// CURRENT_USER
router.get('/api/users/admin/currentuser', verifyAdminToken, validateRequest, AuthDomain.currentUser);

//Delete Single User
router.put('/api/users/admin/statuschange/:id', verifyAdminToken, validateRequest, AuthDomain.statusChangeId);

//mail trigger for forgotpassword
router.post('/api/users/admin/forgotpassword/mailtrigger', Validation.forgotPasswordValidation, validateRequest, AuthDomain.forgotPassword);

//code verify for forgotpassword
router.post('/api/users/admin/forgotpassword/codeverify', Validation.forgotCodeValidation, validateRequest, AuthDomain.forgotPasswordCodeVerification);

//update permission
router.put('/api/users/admin/updatepermission', Validation.updateRoleValidation, verifyAdminToken, validateRequest, AuthDomain.updateAdminRoles);

//admin approve waiting list
router.post('/api/users/admin/waitinglist',verifyAdminToken, validateRequest,AuthDomain.waitingListApprove)

// SIGN-OUT
router.post('/api/users/admin/signout',verifyAdminToken, AuthDomain.signOut);

//TODO :: middle ware is pending

//get all admin
router.get('/api/users/admin/getalladmin', AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/users/admin/getadmindetail/:id', AuthDomain.getUserById);

//get admin rule details
router.get('/api/users/admin/getadminrules/:id', AuthDomain.getUserRuleId);



//get admin by name serch
router.get('/api/users/admin/getadminbyname/:name', AuthDomain.getAdminByName);



export { router as adminAuthRouter };
