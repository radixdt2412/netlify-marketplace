import { ObjectId } from 'mongodb';
import { BadRequestError } from '@rx-marketplace/common';
import { adminSwitches } from '../models/admin-switch';
import { Customer, CustomerAttrs } from '../models/customer';
import { invitionCode } from '../models/invition-code';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { MailService } from '../services/mail-services';
import shortid from 'shortid';
import { PayloadType } from '../services/string-values';
import { natsWrapper } from '../nats-wrapper';
import { CutomerCreatedPublisher } from '../events/publisher/customer-publisher';
import { Device } from '../models/device';
import { otp } from '../models/otp';

export class CustomerAuthDatabaseLayer {

    static async isExistingEmail(email: String) {
        const existingEmail = await Customer.findOne({ $and: [{ email }, { isActive: true }] });
        console.log(existingEmail);

        return existingEmail;
    }
    static async isExistingPhone(phoneNumber: Number) {
        const existingPhone = await Customer.findOne({ $and: [{ phoneNumber }, { isActive: true  }] });
        return existingPhone;
    }

    static async updateRefreshToken(id: ObjectId, email: string, phoneNumber: Number) {
        const refreshToken = await JwtService.refreshToken({ email: email, id: id, phoneNumber: phoneNumber, type: 'Customer' });
        const customer = await Customer.findByIdAndUpdate(id, { refreshToken: refreshToken });
        return customer?.refreshToken;
    }

    static async inviteOnlyGenralSwitch(req: any) {
        var res = await adminSwitches.find({ name: 'inviteOnly' });
        if (res.length != 0) {
            await adminSwitches.updateMany({ name: 'inviteOnly' }, { $set: { status: req.params.status } });
        } else {
            var admin = adminSwitches.build({ name: 'inviteOnly', status: Boolean(req.params.status) });
            await admin.save();
        }
        return req.params.status=="true" ? true : false;
    }

    static async signUpUser(req: any, inviteCode: string) {

        const adminInviteCase = await adminSwitches.findOne({ name: 'inviteOnly' });
        console.log('invite check');
        console.log(adminInviteCase?.status);
        const { name, email, password, phoneNumber, refralCode, isWaiting, confirmPassword } = req.body;
        if (password === confirmPassword) {
            var user: CustomerAttrs;
            try {
                user = { name, password, inviteCode };
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

                if (adminInviteCase?.status == false) {
                    console.log("Admin switch\'s off So directly Signin ");
                    user.status = "New";

                } else if (adminInviteCase?.status && isWaiting == true) {
                    console.log('isWaiting apply so directly in waiting list');
                    user.status = "pending";

                } else if (adminInviteCase?.status && refralCode != null && refralCode != undefined) {
                    console.log('invite code verify logic');

                    //invite code verify
                    const inviteCodeCheck = (user.email ?
                        await invitionCode.findOne({ $and: [{ email: user.email }, { type: 'email' }, { code: refralCode },] }) :
                        await invitionCode.findOne({ $and: [{ type: 'phoneNumber' }, { code: refralCode }, { phoneNumber: user.phoneNumber }] }));


                    if (inviteCodeCheck) {
                        console.log('inviteCodeCheck', inviteCodeCheck);

                        //Day difference for expireDay check
                        const timeStamp: any = inviteCodeCheck?.updated_at;
                        const diff = new Date().getTime() - timeStamp;
                        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

                        console.log(diffDays);
                        console.log(inviteCodeCheck?.expirationDays!);

                        if (inviteCodeCheck?.expirationDays! > diffDays) {
                            //referalId
                            user.referalType = 'Admin';
                            user.referalId = inviteCodeCheck.created_By;

                            //authnticate email or phonenumber
                            inviteCodeCheck.type == 'email' ? user.isEmailVerified = true : user.isPhoneVerified = true;
                            await invitionCode.updateOne({ _id: inviteCodeCheck.id }, { $set: { isUsed: true } });

                        } else {
                            throw new BadRequestError('Ohh No!! Your invition code is exppired');
                        }
                    } else {

                        //refer by customer
                        const inviteCodeCheck = await Customer.findOne({ inviteCode: refralCode })
                        console.log(inviteCodeCheck);

                        if (inviteCodeCheck) {
                            user.referalType = 'CustomerUser';
                            user.referalId = inviteCodeCheck._id;
                        } else {
                            //inviteCode not verified
                            throw new BadRequestError('Your Invite Code is not verify');
                        }
                    }
                } else {
                    throw new BadRequestError('Invite Code is must needed');
                }
                const storeData = Customer.build(user);
                storeData.refreshToken = await JwtService.refreshToken({ email: storeData.email, id: storeData._id, phoneNumber: storeData.phoneNumber, type: 'CustomerUser', })
                await storeData.save();

                var payload = {
                    id: storeData.id,
                    email: storeData.email,
                    phoneNumber: storeData.phoneNumber,
                    type: PayloadType.CustomerType,
                };

                var userJwt = await JwtService.accessToken(payload);

                // Store it on session object
                req.session = { jwt: userJwt };
                await new CutomerCreatedPublisher(natsWrapper.client).publish({
                    id: storeData.id,
                    name: storeData.name,
                    email: storeData.email,
                    phoneNumber: storeData.phoneNumber
                })

                if (storeData.status === 'pending') {
                    const resData = JSON.parse(JSON.stringify(storeData));
                    resData.accessToken = null;
                    resData.flag = true;
                    return ({userId:storeData._id, accessToken: null, refreshToken: storeData.refreshToken,isMFA:storeData.isMFA,SignupFlag:true })
                }

                const resData = JSON.parse(JSON.stringify(storeData));
                resData.accessToken = userJwt;
                resData.flag = false;
                await CustomerAuthDatabaseLayer.deviceDataCreate(storeData._id, req.body.deviceId, req.body.fcmToken, req.body.deviceType);
                return ({userId:storeData._id, accessToken: userJwt, refreshToken: storeData.refreshToken,isMFA:storeData.isMFA,SignupFlag:false })
                

            } catch (error: any) {
                throw new BadRequestError(error.message);
            }
        } else {
            throw new BadRequestError("Password is not match")
        }

    }

    static async checkPassword(existingPassword: string, password: string) {
        return await Password.compare(existingPassword, password);
    }

    static async getAllUsers() {
        return await Customer.find({ isDelete: false });
    }

    static async getUserById(id: any) {
        const customer = await Customer.findById(id);
        return customer;
    }

    static async deleteUserById(req:any) {
        const user = await Customer.findByIdAndUpdate(req.currentUser.id, { $set: { isActive: false, } });
        return user;
    }

    static async getUserByName(name: string) {
        const user = await Customer.find({ $and: [{ name: { $regex: name + '.*', $options: 'i' } }, { isDelete: false }] });
        return user;
    }

    static async currentLoginUser(req: any) {
        const user = await Customer.findById({ _id: req.currentUser.id });
        console.log(user);

        return user;
    }

    static async updateUserInfo(req: any) {
        try {
            const {firstName,lastName,gender,email,phoneNumber } = req.body;
            const currentDate = new Date();
            const updated_at = currentDate.getTime();
            const customerData = await Customer.findById(req.currentUser.id);
            // const imageUrlCheck = (imageUrl === undefined || imageUrl === null) ? customerData?.imageUrl : imageUrl;
            // const isReadReceiptCheck = (isReadReceipt === undefined || isReadReceipt === null) ? customerData?.isReadReceipt : isReadReceipt;
            // const isEmailVisibleCheck = (isEmailVisible === undefined || isEmailVisible === null) ? customerData?.isEmailVisible : isEmailVisible;
            // const isAddressVisibleCheck = (isAddressVisible === undefined || isAddressVisible === null) ? customerData?.isAddressVisible : isEmailVisible;
            // const isAllowToAddGroupCheck = (isAllowToAddGroup === undefined || isAllowToAddGroup === null) ? customerData?.isAllowToAddGroup : isAllowToAddGroup;
            // const allowFriendsToAddGroupCheck = (allowFriendsToAddGroup === undefined || allowFriendsToAddGroup === null) ? customerData?.allowFriendsToAddGroup : allowFriendsToAddGroup;
            // const isAllowToRecieveBrodcastCheck = (isAllowToRecieveBrodcast === undefined || isAllowToRecieveBrodcast === null) ? customerData?.isAllowToRecieveBrodcast : isAllowToRecieveBrodcast;
            // const isLastSeenActiveCheck = (isLastSeenActive === undefined || isLastSeenActive === null) ? customerData?.isLastSeenActive : isLastSeenActive;
            // const isAllowToChatStrangerCheck = (isAllowToChatStranger === undefined || isAllowToChatStranger === null) ? customerData?.isAllowToChatStranger : isAllowToChatStranger;
            const data = await Customer.findById(req.currentUser.id);
            if(data?.phoneNumber!=phoneNumber){
                var p=await this.isExistingPhone(phoneNumber);
                if(p){
                    throw new BadRequestError("phoneNumber is already exist in our system");
                }
            }
            if(data?.email!=email){
                var d=await this.isExistingEmail(email);
                
                if(d){
                    throw new BadRequestError("Email is already exist in our system");
                }
            }
            const accessToken = await JwtService.accessToken({ email: email, id: req.currentUser.id, phoneNumber: phoneNumber, type: 'Customer' });
          
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(req.currentUser.id, email, phoneNumber)
            await Customer.findByIdAndUpdate(req.currentUser.id, {
                'firstName':firstName,
                'lastName':lastName,
                'gender':gender,
                'email':email,
                'phoneNumber':phoneNumber,
                'refreshToken':newRefreshToken
                // 'name': name,
                // 'imageUrl': imageUrlCheck,
                // 'isReadReceipt': isReadReceiptCheck,
                // 'isEmailVisible': isEmailVisibleCheck,
                // 'isAddressVisible': isAddressVisibleCheck,
                // 'isAllowToAddGroup': isAllowToAddGroupCheck,
                // 'allowFriendsToAddGroup': allowFriendsToAddGroupCheck,
                // 'isAllowToRecieveBrodcast': isAllowToRecieveBrodcastCheck,
                // 'isLastSeenActive': isLastSeenActiveCheck,
                // 'isAllowToChatStranger': isAllowToChatStrangerCheck,
            });
            return {'firstName':firstName,
            'lastName':lastName,
            'gender':gender,
            'email':email,
            'phoneNumber':phoneNumber,'accessToken':accessToken};
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async emailVerification(email: any, userId: any) {

        try {
            // const customerData = await Customer.findById(userId);
            const code = shortid.generate();
            var createVerificationCode = otp.build({
                type: 'email',
                email: email,
                userId: userId,
                code: code
            })
            await createVerificationCode.save();
            await MailService.mailTrigger(email, 'Email Verification', "<h1>Hello ,</h1><p>here, is your email verfication code,</br> pls enter it in email verification code field <B>" + code + "</B> . </p>");
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async emailCodeVerification(req: any) {
        const { code } = req.body;
        const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { email: req.currentUser.email }] })
        if (inviteCodeCheck) {
            await Customer.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isEmailVerified: true });
            return;
        } else {
            throw new BadRequestError('Your Code is not matched');
        }

    }

    static async phoneVerification(req: any) {
        try {
            if (req.currentUser.phoneNumber != null && req.currentUser.phoneNumber != undefined) {
                const customerData = await Customer.findById(req.currentUser.id);
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

                    //return await MailService.mailTrigger(code, customerData.email, 'phone Verification', customerData.name);

                }
            } else {
                throw new BadRequestError('You Login with email address')
            }
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async phoneCodeVerification(req: any) {
        const { code } = req.body;
        try {
            const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { phoneNumber: req.currentUser.phoneNumber }] })
            if (inviteCodeCheck) {

                await Customer.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isPhoneVerified: true });
                return;

            } else {
                throw new BadRequestError('Your Code is not matched');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }

    }
    static async forgotPasswordMailTrigger(req: any) {

        const email = req.body.email;
        try {
            const userData = await Customer.findOne({ email: email });
            if (userData) {
                const code = shortid.generate();
                var createVerificationCode = otp.build({
                    type: 'email',
                    email: email,
                    code: code
                })
                await createVerificationCode.save();
                
                await MailService.mailTrigger(email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
                return;
            } else {
                throw new BadRequestError('Ohh No!!Email not found!! You Login with PhoneNumber')
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    //forgot password with code verify  
    static async forgotPasswordCodeVerification(req: any) {
        const { email, code, password,confirmPassword } = req.body;
        if(password===confirmPassword){
        try {
            const inviteCodeCheck = await otp.findOne({ $and: [{ code: code }, { email: email }] })
            if (inviteCodeCheck) {
                const hased = await Password.toHash(password);
                const userData = await Customer.findOne({ email: email });
                if (userData) {
                    await Customer.findByIdAndUpdate(userData.id, { password: hased });
                    return;
                } else {
                    throw new BadRequestError("Email Not Found!!!")
                }
            } else {
                throw new BadRequestError('Your Code is not matched');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
        }else{
            throw new BadRequestError("password is not matched")
        }
    }

    static async getInviteOnlyGenralSwitch(req: any) {
        var res = await adminSwitches.find({ name: 'inviteOnly' });
        if (res.length != 0) {
            return res[0].status;
        } else {
            throw new BadRequestError("Data not found");
        }

    }

    static async deviceDataCreate(userId: string, deviceId: string, fcmToken: string, deviceType: string,) {
        try {
            const data = Device.build({
                deviceId: deviceId,
                userId: userId,
                fcmToken: fcmToken,
                deviceType: deviceType
            })
            await data.save();
            //Streaming pending
            return;
        } catch (e: any) {
            throw new BadRequestError(e.message)
        }
    }
}

