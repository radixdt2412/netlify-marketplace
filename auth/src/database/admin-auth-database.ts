

import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { PayloadType, Strings } from '../services/string-values';
import { AdminPermissions,AdminPermissionsAttrs,} from '../models/admin-permissions';
import { MailService } from '../services/mail-services';
import shortid from 'shortid';
import { natsWrapper } from '../nats-wrapper';
import { AdminPermissionCreatedPublisher } from '../events/publisher/admin-permission-publisher';
import { AdminRole } from '../models/admin-role';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { AdminAttrs,Admin } from '../models/admin';
import { Customer } from '../models/customer';
import { BadRequestError } from '@rx-marketplace/common';
import { otp } from '../models/otp';

export class AuthDatabaseLayer {  


  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async addAdminUser(req: any) {

    try {

      const adminData = await Admin.findById({ _id: req.currentUser.id });
      if (adminData?.isSuperAdmin == true) {
        const { userName, email, password, phoneNumber, isAllowChangePassword, storeId, roleId } = req.body;
        const roleCheck = await AdminRole.findById(roleId);
        if (!roleCheck) {
          throw new BadRequestError('role id is wrong');
        }
        var user: AdminAttrs;
        const hashPassword = await Password.toHash(password);
        user = { userName: userName, password: hashPassword, allowChangePassword: isAllowChangePassword, roleId: roleId };
        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
          console.log('phone not defined,\nSo email signup');
          user.email = email;
          user.phoneNumber = null;
        }

        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
          console.log('email not defined,\nSo phone signup');
          user.phoneNumber = phoneNumber;
          user.email = null;
        }

        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email != null && req.body.email != undefined) {
          user.phoneNumber = phoneNumber;
          user.email = email;
        }

        const adminData = Admin.build(user);
        await adminData.save();
        if (user.email != null) {
          await MailService.mailTrigger(req.currentUser.email, 'Admin Credentials', "<h1>Hello,</h1><p>here, is your admin credentials,</br> pls enter it when you login to application as admin <B> Email:" + user.email + "</br>Password:" + user.password + "</B> . </p>")
        } else {
          //TODO sms trigger
        }
        return adminData;

      } else {
        throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
      }
    }
    catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async checkRoleMapping(tableName: string, isCreate: boolean, isUpdate: boolean, isDelete: boolean, isRead: boolean) {
    try {
      tableName = tableName.toLowerCase();
      const tableCheck = await AdminPermissions.findOne({ $and: [{ tableName: tableName }, { isCreate: isCreate }, { isUpdate: isUpdate }, { isDelete: isDelete }, { isRead: isRead }] })
      if (!tableCheck) {
        const role = AdminPermissions.build({ tableName: tableName, isRead: isRead, isCreate: isCreate, isDelete: isDelete, isUpdate: isUpdate });
        await role.save();
        await new AdminPermissionCreatedPublisher(natsWrapper.client).publish({
          id: role.id,
          tableName: role.tableName,
          isCreate: role.isCreate,
          isDelete: role.isDelete,
          isUpdate: role.isUpdate,
          isRead: role.isRead
        })
        return { _id: role.id.toString() }
      } else {
        return { _id: tableCheck.id.toString() };
      }
    }
    catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

  static async isSuperAdmin(email: String) {
    const isSuperAdminUser = await Admin.find({
      email: email,
      isActive: true,
      isSuperAdmin: true,
    });
    if (isSuperAdminUser.length > 0) {
      return isSuperAdminUser[0];
    }
  }

  static async addPermission(data: AdminPermissionsAttrs) {
    const permission = AdminPermissions.build(data);
    await permission.save();
    return permission;
  }

  static async findPermission(permissionId: any) {
    var permission = await AdminPermissions.findById(permissionId);
    if (!permission) {
      throw new BadRequestError('Permissions not found in Add permission');
    }
    return permission;
  }

  static async isExistingUser(email: String) {
    const existingUser = await Admin.findOne({ email });
    return existingUser;
  }

  static async findUserByActiveEmails(email: string) {
    const adminUser = await Admin.find({ email: email, isActive: true });
    if (adminUser.length > 0) {
      return adminUser[0];
    }
  }

  static async isExistingEmail(email: String) {
    const existingEmail: any = await Admin.findOne({ $and: [{ email: email }, { isActive: true }] });
    return existingEmail;
  }

  static async isExistingPhone(phoneNumber: Number) {
    const existingPhone: any = await Admin.findOne({ $and: [{ phoneNumber: phoneNumber }, { isActive: true }] });    
    return existingPhone;
  }

  //not in use
  static async signUpUser(data: AdminAttrs) {
    const hashPassword = await Password.toHash(data.password);
    const user = Admin.build(data);
    
    var payload = {
      id: user.id,
      email: user.email,
      type: PayloadType.AdminType,
    };

    const jwtToken = await JwtService.accessToken(payload);
    
    user.password = hashPassword;
    user.refreshToken = jwtToken;
    user.isActive = true;
    user.isSuperAdmin = false;
    
    await user.save();

    return jwtToken;
  }

  // verify active email & password
  static async verifyEmailAndPassword(email: string, password: string) {
    const adminUser = await this.findUserByActiveEmails(email);
    if (adminUser) {
      const checkPassword = await Password.compare(
        adminUser.password,
        password
      );

      if (!checkPassword) {
        throw new BadRequestError(Strings.invalidPassword);
      }

      return adminUser;
    } else {
      throw new BadRequestError(Strings.invalidEmail);
    }
  }

  // update refresh token in admin user
  static async updateRefreshToken(id: string, email: string, phoneNumber: Number) {

    const refreshToken = await JwtService.refreshToken({ email: email, id: id, phoneNumber: phoneNumber, type: PayloadType.AdminType });
    const admin = await Admin.findByIdAndUpdate(id, { refreshToken: refreshToken });
    return admin?.refreshToken;
    
  }

  static async getAllUsers() {
    return await Admin.find()
  }

  static async getUserById(id: any) {
    var data = await Admin.findOne({ _id: id })
    return data;
  }

  static async getUserRuleId(id: any) {
    var data = await Admin.findOne({ _id: id })
    if (data) {

      const roleData = await AdminRoleMapping.find({roleId:data.roleId}).populate('permissionId');
      if(roleData){ 
        const resData = JSON.parse(JSON.stringify(data));
        resData.permission=roleData;
        return resData;
      }
    } else {
      throw new BadRequestError('given id is not exist');
    }
  }

  static async getCurrentUser(id: any) {
    var data = await Admin.findOne({ _id: id }).populate('roleId')
    
    const roleData= await AdminRoleMapping.find({roleId:(data?.roleId.id)}).populate('permissionId');
    
    var resData = JSON.parse(JSON.stringify(data))
    resData.role=roleData;
    return resData;
  }

  static async statusChangeId(req: any, id: any) {

    const adminData = await Admin.findOne({ _id: req.currentUser.id });

    if (adminData) {
      if (adminData.isSuperAdmin == true) {
        const data = await Admin.findById({ _id: id });
        if (data) {
          var status = data.isActive ? false : true;
          await Admin.findByIdAndUpdate(id, { isActive: status });
        }
        return;
      }
    } else {
      throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
    }
  }

  static async getAdminByName(name: any) {
    console.log('name', name);

    var data = await Admin.find({ userName: { $regex: name + '.*', $options: 'i' } });
 
      return data;
    

  }

  static async forgotPasswordMailTrigger(req: any) {
    try {
      const { email } = req.body;
      const emailData = await Admin.findOne({ email: req.body.email });

      if (emailData) {
        if (emailData.allowChangePassword == true) {
          const code = shortid.generate();
          var createVerificationCode = otp.build({
            type: 'email',
            email: req.body.email,
            code: code,
          })

          await createVerificationCode.save();
          await MailService.mailTrigger(req.body.email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
          return;

        } else {
          throw new BadRequestError('Given email has no rights to change password')
        }
      }
      else {
        throw new BadRequestError('Given email is not existing in our system')
      }
    } catch (e: any) {
      throw new BadRequestError(e.message)

    }

  }

  //forgot password with code verify  
  static async forgotPasswordCodeVerification(req: any) {
    const { code, password } = req.body;
    const inviteCodeCheck = await otp.findOne({ code: code })
    if (inviteCodeCheck) {
      const hased = await Password.toHash(password);
      const data = await Admin.findOneAndUpdate({ email: inviteCodeCheck.email }, { password: hased });
      if (data) {
        const accessToken = await JwtService.accessToken({ email: data.email, id: data.id, phoneNumber: data.phoneNumber, type: PayloadType.AdminType });
        const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(data.id, data.email, data.phoneNumber)
        req.session = { jwt: accessToken };
        return { accessToken: accessToken, refreshToken: newRefreshToken }
      } else {
        throw new BadRequestError('Something wrong');
      }
    } else {
      throw new BadRequestError('Your Code is not matched');
    }
  }

  static async updateAdminRoles(req: any) {
    const roleId=req.body.roleId;

    const adminUserData = await Admin.findById(req.body.id);
    if (adminUserData) {
      await Admin.findByIdAndUpdate(req.body.id, { roleId: roleId });
      const adminData = await Admin.findById(req.body.id);
      return adminData;
    } else {
      throw new BadRequestError('sended id is not valid')
    }
  }


  static async addRole(req: any) {
    const { roleName, permissionId } = req.body;

    const data = AdminRole.build({
      name: roleName
    })

    await data.save();
    await Promise.all(permissionId.map(async (e: any) => {
      const permissionCheck = await AdminPermissions.findById(e);
      if (!permissionCheck) {
        throw new BadRequestError("Data not found");
      }
    }))

    await Promise.all(permissionId.map(async (e: any) => {
      const roleMappingData = AdminRoleMapping.build({
        roleId: data.id,
        permissionId: e
      });
      await roleMappingData.save();
    }))

    return data;
  }

  static async waitingListApprove(req:any){
    const {customerId,status}=req.body;
    const userCheck = await Customer.findById(customerId);
    if(userCheck){
      if(status == "Approved"){
       await Customer.findByIdAndUpdate(customerId,{status:status});
      }else if(status == "Rejected"){
        await Customer.findByIdAndDelete(customerId);
      }else{
        throw new BadRequestError("status is invalid");
      }
      return;
    }else{
      throw new BadRequestError('CustomerId is wrong');
    }
  }
}
