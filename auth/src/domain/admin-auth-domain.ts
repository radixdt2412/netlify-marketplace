import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthDatabaseLayer } from '../database/admin-auth-database';
import { AdminAttrs } from '../models/admin';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { JwtService } from '../services/jwt';
import { PayloadType, Strings } from '../services/string-values';

export class AuthDomain {

  static async addAdmin(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;
    var exitstingPhone: any;
    var existingUser: any;

    if (email != undefined || email != null) {
      existingUser = await AuthDatabaseLayer.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      exitstingPhone = await AuthDatabaseLayer.isExistingPhone(phoneNumber);
    }

    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }

    if (exitstingPhone) {
      throw new BadRequestError('Phone is Already in use');
    }

    var user = await AuthDatabaseLayer.addAdminUser(req);
    return res.send(responseSuccess({ result: user }));
  }

  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
    var isPermissionAdded = await AuthDatabaseLayer.addPermission(data);
    if (isPermissionAdded) {
      res.send(responseSuccess({ result: isPermissionAdded }));
    } else {
      throw new BadRequestError('permission not created');
    }
  }

  static async signUp(req: any, res: Response) {
    const { email, permissionId } = req.body;
    var superAdmin = await AuthDatabaseLayer.isSuperAdmin(req.currentUser.email);
    if (superAdmin) {
      const existingUser = await AuthDatabaseLayer.isExistingUser(email);
      if (existingUser) {
        throw new BadRequestError(Strings.emailInUse);
      }

      var userPermission = await AuthDatabaseLayer.findPermission(permissionId);
      if (userPermission) {
        const data: AdminAttrs = req.body;
        var jwtToken = await AuthDatabaseLayer.signUpUser(data);
        req.session = { jwt: jwtToken };
        return res
          
          .send(responseSuccess({result:Strings.registrationSuccess}));
      } else {
        throw new BadRequestError('Permission is not defined');
      }
    } else {
      throw new BadRequestError('UnAuthorized User');
    }
  }

  static async signIn(req: Request, res: Response) {

    const { password } = req.body;
    var email: string, phoneNumber: Number, isEmail = false;

    var exitstingEmail: any, existingPhone: any;

    if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
      console.log('phone not defined,\nSo email signup');
      email = req.body.email;
      exitstingEmail = await AuthDatabaseLayer.isExistingEmail(email)
      console.log('exitstingEmail', exitstingEmail);
      isEmail = true;
    }

    if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
      console.log('email not defined,\nSo phone signup');
      phoneNumber = req.body.phoneNumber;
      existingPhone = await AuthDatabaseLayer.isExistingPhone(phoneNumber)
      console.log('existingPhone', existingPhone);
    }


    if (isEmail && !exitstingEmail) {
      throw new BadRequestError('Invalid Email');
    }

    if (isEmail == false && !existingPhone) {
      throw new BadRequestError('Invalid PhoneNumber');
    }

    const passwordMatch = await AuthDatabaseLayer.checkPassword(
      isEmail ? exitstingEmail.password : existingPhone.password,
      password
    );


    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }

    if (exitstingEmail) {

      const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, type: PayloadType.AdminType });
      const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
      req.session = { jwt: accessToken };
      return res.send(responseSuccess({result:{ accessToken: accessToken, refreshToken: newRefreshToken }}))

    } else if (existingPhone) {

      const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, type: PayloadType.AdminType });
      const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
      req.session = { jwt: accessToken };
      return res.send(responseSuccess({result:{ accessToken: accessToken, refreshToken: newRefreshToken }}))

    }
  }

  static async getAllUsers(req: Request, res: Response) {
    var users = await AuthDatabaseLayer.getAllUsers();
    res.send(responseSuccess({result:users}));
  }

  // //Get Single user detail
  static async getUserById(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    const user = await AuthDatabaseLayer.getUserById(req.params.id);
    if (!user) {
      throw new BadRequestError(Strings.userDoesNotExist);
    }
    res.send(responseSuccess({result:user}));
  }


  static async getUserRuleId(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    const user = await AuthDatabaseLayer.getUserRuleId(req.params.id);
    if (!user) {
      throw new BadRequestError(Strings.userDoesNotExist);
    }
    res.send(responseSuccess({result:user}));
  }


  //Delete user by Id
  static async statusChangeId(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    await AuthDatabaseLayer.statusChangeId(req, req.params.id);
    res.send(responseSuccess());
  }

  // SIGN-OUT
  static async signOut(req: Request, res: Response) {
    req.session = null;
    res.send(responseSuccess());
  }

  // // CURRENT_USER
  static async currentUser(req: Request, res: Response) {
    if (req.currentUser?.id) {
      const data = await AuthDatabaseLayer.getCurrentUser(req.currentUser.id);
      res.send(responseSuccess({result:data}));
    } else {
      throw new BadRequestError('Token/session not founded')
    }
  }

  static async getAdminByName(req: Request, res: Response) {
    const adminData = await AuthDatabaseLayer.getAdminByName(req.params.name);
    res.send(responseSuccess({result:adminData}));
  }

  static async forgotPassword(req: Request, res: Response) {
    await AuthDatabaseLayer.forgotPasswordMailTrigger(req);
    res.send(responseSuccess());
  }

  static async forgotPasswordCodeVerification(req: Request, res: Response) {
    const data = await AuthDatabaseLayer.forgotPasswordCodeVerification(req);
    res.send(responseSuccess({result:data}));
  }

  static async updateAdminRoles(req: Request, res: Response) {
    const data = await AuthDatabaseLayer.updateAdminRoles(req);
    res.send(responseSuccess({result:data}));
  }

  static async addRole(req: Request, res: Response) {
    const data = await AuthDatabaseLayer.addRole(req);
    res.send(responseSuccess({result:data}));
  }

  static async waitingListApprove(req: Request, res: Response) {
    await AuthDatabaseLayer.waitingListApprove(req);
    res.send(responseSuccess());
  }
}
