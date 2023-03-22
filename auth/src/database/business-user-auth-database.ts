import { ObjectId } from 'mongodb';
import { BadRequestError } from "@rx-marketplace/common";
import { JwtService } from '../services/jwt';
import { BusinessUser, BusinessUserAttrs } from '../models/business-user';
import { Password } from '../services/password';
import shortid from 'shortid';
import { MailService } from '../services/mail-services';
import { BusinessUserCreatedPublisher } from '../events/publisher/business-user-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PayloadType } from '../services/string-values';
import { Store } from '../models/store';
import { BusinessRoleType, BusinessRoleTypeAttrs } from '../models/business-role-type';
import { BusinessRoleMapping, BusinessRoleMappingAttrs } from '../models/business-role-mapping';
import { BusinessRoleMappingCreatedPublisher } from '../events/publisher/business-role-mapping-publisher';
import { BusinessRoleTypeCreatedPublisher } from '../events/publisher/business-role-publisher';
import { otp } from '../models/otp';

export class BusinessUserAuthDatabaseLayer {

    static async isExistingEmail(email: String) {
        const existingEmail: any = await BusinessUser.findOne({ $and: [{ email }, { isDelete: false }] });
        console.log(existingEmail);
        return existingEmail;
    }

    static async isExistingPhone(phoneNumber: Number) {
        const existingPhone = await BusinessUser.findOne({ $and: [{ phoneNumber }, { isDelete: false }] });
        return existingPhone;
    }

    static async updateRefreshToken(id: ObjectId, email: string, phoneNumber: Number) {
        const refreshToken = await JwtService.refreshToken({ email: email, id: id, phoneNumber: phoneNumber, type: PayloadType.Vendor });
        const customer = await BusinessUser.findByIdAndUpdate(id, { refreshToken: refreshToken });
        return customer?.refreshToken;
    }

    static async signUpUser(req: any) {
        const { name, email, password, phoneNumber } = req.body;

        var user: BusinessUserAttrs;

        user = { name, password };
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

        const data = BusinessUser.build(user);
        data.createdBy = data.id;
        data.refreshToken = await JwtService.refreshToken({ email: data.email, id: data._id, phoneNumber: data.phoneNumber, type: PayloadType.Vendor, })
        await data.save();
        await new BusinessUserCreatedPublisher(natsWrapper.client).publish({
            id: data.id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            isActive: true,
            createdBy: data.id.toString(),
            storeId: null
        })
        return data;
    }

    static async checkPassword(existingPassword: string, password: string) {
        return await Password.compare(existingPassword, password);
    }

    static async getAllUsers() {
        return await BusinessUser.find().populate('store');
    }

    static async getAllActiveUsers() {
        return await BusinessUser.find({ isActive: true }).populate('store');
    }

    static async getAllDeActiveUsers() {
        return await BusinessUser.find({ isActive: false }).populate('store');
    }


    static async getUserById(id: any) {
        const customer = await BusinessUser.findById(id);
        if (customer) {
            return customer;
        } else {
            throw new BadRequestError('given id is not in DB');
        }
    }

    static async deleteUserById(id: string) {

        const data = await BusinessUser.findById(id);

        if (data && data.isActive) {
            if (data.id == data?.createdBy) {
                ///logic gone wrong
                const userData = await BusinessUser.find({ $and: [{ createdBy: data.id }, { isActive: true }, { _id: { $ne: data.id } }] })
                if (userData.length != 0) {
                    const user = await BusinessUser.updateOne({ _id: id }, { $set: { isActive: false, } });
                    return user;
                } else {
                    throw new BadRequestError('Deactive is not possible due to one profile handler');
                }
            } else if (data.store) {
                const userData = await BusinessUser.find({ $and: [{ store: data.store }, { _id: { $ne: data.id } }, { isActive: true },] });
                if (userData.length != 0) {
                    const user = await BusinessUser.updateOne({ _id: id }, { $set: { isActive: false, } });
                    return user;
                } else {
                    throw new BadRequestError('Deactive is not possible due to one profile handler');
                }

            } else {
                throw new BadRequestError('Deactive is not possible');
            }
        } else if (data && data?.isActive == false) {
            const user = await BusinessUser.updateOne({ _id: id }, { $set: { isActive: true, } });
            return user;
        }
        else {
            throw new BadRequestError('given id data not exists in DB');
        }
    }

    static async getUserByName(name: string) {
        const user = await BusinessUser.find({ $and: [{ name: { $regex: name + '.*', $options: 'i' } }, { isDelete: false }] });
        return user;
    }

    static async currentLoginUser(req: any) {
        const user = await BusinessUser.findById({ _id: req.currentUser.id });
        if (user) {
            return user;
        } else {
            throw new BadRequestError('Data Not Found');
        }
    }

    static async emailVerification(req: any) {
        if (req.currentUser.email != null && req.currentUser.email != undefined) {
            const customerData = await BusinessUser.findById(req.currentUser.id);
            if (customerData && customerData.isEmailVerified == false) {
                const code = shortid.generate();
                var createVerificationCode = otp.build({
                    type: 'email',
                    email: customerData.email,
                    userId: req.currentUser.id,
                    code: code,
                })
                await createVerificationCode.save();
                await MailService.mailTrigger(customerData.email, 'Email Verification', "<h1>Hello,</h1><p>here, is your email verfication code,</br> pls enter it in email verification code field <B>" + code + "</B> . </p>");
                return;

            } else {
                throw new BadRequestError('Your email is already verified')
            }
        } else {
            throw new BadRequestError('You Login with PhoneNumber')
        }
    }

    static async emailCodeVerification(req: any) {
        const { code } = req.body;
        const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { email: req.currentUser.email }] })
        if (inviteCodeCheck) {
            await BusinessUser.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isEmailVerified: true });
            return;
        } else {
            throw new BadRequestError('Your Code is not matched');
        }

    }

    static async phoneVerification(req: any) {

        if (req.currentUser.phoneNumber != null && req.currentUser.phoneNumber != undefined) {
            const customerData = await BusinessUser.findById(req.currentUser.id);
            if (customerData && customerData.isPhoneVerified == false) {
                const code = shortid.generate();
                var createVerificationCode = otp.build({
                    type: 'phone',
                    phoneNumber: req.currentUser.phoneNumber,
                    userId: req.currentUser.id,
                    code: code,
                })
                await createVerificationCode.save();
                //SMS trigger logic pending

                // return await MailService.mailTrigger(code, customerData.email, 'phone Verification', customerData.name);

            }
        } else {
            throw new BadRequestError('You Login with email address')
        }
        return;
    }

    static async phoneCodeVerification(req: any) {
        const { code } = req.body;
        const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { phoneNumber: req.currentUser.phoneNumber }] })
        if (inviteCodeCheck) {
            await BusinessUser.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isPhoneVerified: true });
            return;
        } else {
            throw new BadRequestError('Your Code is not matched');
        }

    }

    static async forgotPasswordMailTrigger(req: any) {

        if (req.currentUser.email != null && req.currentUser.email != undefined) {

            const code = shortid.generate();
            var createVerificationCode = otp.build({
                type: 'email',
                email: req.currentUser.email,
                userId: req.currentUser.id,
                code: code,
            })
            await createVerificationCode.save();
            await MailService.mailTrigger(req.currentUser.email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
            return;
        } else {
            throw new BadRequestError('You Login with PhoneNumber')
        }

    }

    //forgot password with code verify  
    static async forgotPasswordCodeVerification(req: any) {
        const { code, password } = req.body;
        const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { email: req.currentUser.email }] })
        if (inviteCodeCheck) {
            const hased = await Password.toHash(password);
            await BusinessUser.findByIdAndUpdate(req.currentUser.id, { password: hased });
            return;
        } else {
            throw new BadRequestError('Your Code is not matched');
        }
    }

    static async createUser(req: any) {
        const { name, email, password, phoneNumber, isAllowChangePassword, storeId } = req.body;

        var user: BusinessUserAttrs;
        const checkUser = await BusinessUser.findById(req.currentUser.id);
        if (checkUser?.id != checkUser?.createdBy) {
            throw new BadRequestError("user is not able to create another user");
        }
        user = { name, password };
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
        user.allowChangePassword = isAllowChangePassword;

        const storeCheck = await Store.findById(storeId);
        if (storeCheck) {
            user.store = storeId;
        } else {
            throw new BadRequestError('store id is not valid');
        }
        const userData = BusinessUser.build(user);

        userData.createdBy = req.currentUser.id;

        const roleData = req.body.rolesArray;
        const roleDataArr: string[] = [];

        //removing duplication
        roleData.forEach((e: any) => {
            if (!roleDataArr.includes(e.tableName)) {
                roleDataArr.push(e.tableName);
            } else {
                throw new BadRequestError('Repeating table is not possible');
            }
        });

        //role creation
        await Promise.all(roleData.map(async (e: any) => {
            const roleMapData = await BusinessUserAuthDatabaseLayer.checkRoleMapping(e.tableName, e.isCreate, e.isUpdate, e.isDelete, e.isRead, userData.id);
            console.log(roleMapData);
        }));
        userData.refreshToken = await JwtService.refreshToken({ email: userData.email, id: userData._id, phoneNumber: userData.phoneNumber, type: PayloadType.Vendor, })
        await userData.save();
        await new BusinessUserCreatedPublisher(natsWrapper.client).publish({
            id: userData.id,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            name: userData.name,
            isActive: true,
            createdBy: req.currentUser.id,
            storeId: storeId
        })
        return userData;
    }

    static async checkRoleMapping(tableName: string, isCreate: boolean, isUpdate: boolean, isDelete: boolean, isRead: boolean, id: string) {
        var roleMapping: BusinessRoleMappingAttrs;
        roleMapping = { businessUserId: id };
        try {
            const tableCheck = await BusinessRoleType.findOne({ $and: [{ tableName: tableName }, { isCreate: isCreate }, { isUpdate: isUpdate }, { isDelete: isDelete }, { isRead: isRead }] })
            if (!tableCheck) {
                const role = BusinessRoleType.build({ tableName: tableName, isRead: isRead, isCreate: isCreate, isDelete: isDelete, isUpdate: isUpdate });
                console.log(role);
                await role.save();
                await new BusinessRoleTypeCreatedPublisher(natsWrapper.client).publish({
                    id: role.id,
                    tableName: role.tableName,
                    isRead: role.isRead,
                    isCreate: role.isCreate,
                    isDelete: role.isDelete,
                    isUpdate: role.isUpdate
                })
                roleMapping.businessRoleId = role.id;
            } else {
                roleMapping.businessRoleId = tableCheck.id;
            }
            const roleMappingData = BusinessRoleMapping.build(roleMapping);
            await roleMappingData.save();

            await new BusinessRoleMappingCreatedPublisher(natsWrapper.client).publish({
                id: roleMappingData.id,
                businessUserId: roleMappingData.businessUserId.toString(),
                businessRoleId: roleMappingData.businessRoleId.toString()
            })
            return roleMappingData;

        }
        catch (err: any) {
            throw new BadRequestError(err.message);
        }
    }

    static async userGetWithThirRoles(id: any) {

        const userData: any = await BusinessUser.findById(id);
        if (userData) {
            if (userData.id.toString() == userData.createdBy) {
                return { "role": 'business user', 'userData': userData };
            } else {
                const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: id }, { 'businessUserId': 0, }).populate('businessRoleId');
                var data: any;
                data = JSON.parse(JSON.stringify(userData));
                data.userRoles = userRoleMapping;
                console.log('userData.userRoles', data);
                return data;
            }
        } else {
            throw new BadRequestError('user Data not found based on given id');
        }

    }

    static async roleMapping(req: any, id: any) {
        const data = await BusinessUser.aggregate([
            {
                $lookup: {
                    from: 'businessuserusers',
                    localField: 'businessUserId',
                    foreignField: 'id',
                    as: 'userDataId'
                }
            },
            {
                $lookup: {
                    from: 'businessroletypes',
                    localField: 'businessRoleId',
                    foreignField: 'id',
                    as: 'roleId'
                }
            },
        ])

        // const data = await BusinessUser.aggregate([
        //     {
        //         $lookup: {
        //             from: 'businessrolemappings',
        //             localField: '_id',
        //             foreignField: 'businessUserId',
        //             pipeline: [
        //                 {
        //                     $lookup: {
        //                         from: "businessroletypes",
        //                         localField: 'businessRoleId',
        //                         foreignField: '_id',
        //                         pipeline:[
        //                             {$match:{'tableName':{$eq:'order'}}}
        //                         ],
        //                         as: 'roleData'
        //                     }
        //                 },
        //                 {$unwind:'$roleData'},
        //             ],
        //             as: 'MappingData'
        //         },
        //     },
        //     {$unwind:'$MappingData'},
        // ])

        return data;
    }
}