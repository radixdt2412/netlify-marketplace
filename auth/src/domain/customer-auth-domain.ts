import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import shortid from 'shortid';
import mongoose from 'mongoose';
import { CustomerAuthDatabaseLayer } from '../database/customer-auth-databse';
import { JwtService } from '../services/jwt';
import { invitionCode } from '../models/invition-code';
import { CustomerDoc } from "../models/customer";
// import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

export class CustomerDomain {

    // SIGNUP
    static async signUp(req: Request, res: Response) {

        const { email, phoneNumber } = req.body;
        var exitstingPhone;
        var existingUser
        if (email != undefined || email != null) {
            existingUser = await CustomerAuthDatabaseLayer.isExistingEmail(email);
        }
        if (phoneNumber != undefined || phoneNumber != null) {
            exitstingPhone = await CustomerAuthDatabaseLayer.isExistingPhone(phoneNumber);
        }

        if (existingUser) {
            throw new BadRequestError('Email In Use');
        }
        if (exitstingPhone) {
            throw new BadRequestError('Phone is Already in use');
        }
        
        const inviteCode = shortid.generate();

        var user = await CustomerAuthDatabaseLayer.signUpUser(req, inviteCode);
        // const userData = JSON.parse(JSON.stringify(user));
              
        // if(userData.flag==true && userData.data ){
            return res.send(responseSuccess({result:user}));
        // }
        // if(userData.flag==false && userData.data){
        //     return res.send(responseSuccess({result:userData.data}));
        // }
        
    }

    //SIGNIN 
    static async signIn(req: Request, res: Response) {

        const { password } = req.body;
        var email: string, phoneNumber: Number, isEmail = false;

        var exitstingEmail: any, existingPhone: any;

        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            email = req.body.email;
            exitstingEmail = await CustomerAuthDatabaseLayer.isExistingEmail(email)
            isEmail = true;
        }

        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            phoneNumber = req.body.phoneNumber;
            existingPhone = await CustomerAuthDatabaseLayer.isExistingPhone(phoneNumber)
        }

        if (isEmail == true && !exitstingEmail) {
            throw new BadRequestError('Invalid Email');
        }
        if (isEmail == false && !existingPhone) {
            throw new BadRequestError('Invalid PhoneNumber');
        }
       
        const passwordMatch = await CustomerAuthDatabaseLayer.checkPassword(
            isEmail ? exitstingEmail.password : existingPhone.password,
            password
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid Password');
        }
        console.log('check',exitstingEmail.isMFA);
        
        var isMFA=false;
        if(isEmail ? (exitstingEmail.isMFA==true) : (existingPhone.isMFA==true)){
            isMFA=true;
        }

        if (exitstingEmail) {
            const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, type: 'Customer' });
            await CustomerAuthDatabaseLayer.deviceDataCreate(exitstingEmail.id, req.body.deviceId, req.body.fcmToken, req.body.deviceType);
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
            isMFA ? await CustomerAuthDatabaseLayer.emailVerification(exitstingEmail.email,exitstingEmail.id) : ''; 
            return res.send(responseSuccess({result:{userId:exitstingEmail.id, accessToken: accessToken, refreshToken: newRefreshToken,isMFA:isMFA }}))
        } else if (existingPhone) {
            const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, type: 'Customer' });
            await CustomerAuthDatabaseLayer.deviceDataCreate(existingPhone.id, req.body.deviceId, req.body.fcmToken, req.body.deviceType);
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
            return res.send(responseSuccess({result:{ userId:existingPhone.id, accessToken: accessToken, refreshToken: newRefreshToken,isMFA:isMFA }}))
        }
    }


    //GET ALL USER DATA
    static async getAllUsers(req: Request, res: Response) {
        var customer = await CustomerAuthDatabaseLayer.getAllUsers();
        res.send(responseSuccess({result:customer}));
    }

    //GET USER BY ID
    static async getUserById(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const customer = await CustomerAuthDatabaseLayer.getUserById(req.params.id);
        if (!customer) {
            throw new BadRequestError("customer doesn't exist");
        }
        res.send(responseSuccess({result:customer}));
    }

    //Delete user by Id
    static async deleteUserById(req: Request, res: Response) {
        const deletedCount = await CustomerAuthDatabaseLayer.deleteUserById(req);
        res.send(responseSuccess({result:{
            success: true,
            message: `Deleted`,
        }}));
    }

    //Get User By name 
    static async getUserByName(req: Request, res: Response) {
        const customer = await CustomerAuthDatabaseLayer.getUserByName(req.params.name);
        res.send(responseSuccess({result:customer}));
    }

    //update personal info
    static async updateUserInfo(req: Request, res: Response) {
        const data=await CustomerAuthDatabaseLayer.updateUserInfo(req);
        res.send(responseSuccess({result:data}));;
    }

    //currentLoginUSer
    static async currentLoginUser(req: Request, res: Response) {
        const currentUser = await CustomerAuthDatabaseLayer.currentLoginUser(req);
        res.send(responseSuccess({result:currentUser}));
    }

    //mail verification code verify
    static async emailCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.emailCodeVerification(req);
        res.send(responseSuccess());
    }

    //Phone Verification
    static async phoneVerification(req: Request, res: Response) {
        const mailTrigger = await CustomerAuthDatabaseLayer.phoneVerification(req);
        res.send(responseSuccess());
    }

    //phone verification code verify
    static async phoneCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.phoneCodeVerification(req);
        res.send(responseSuccess());
    }

    //email trigger for forgot password
    static async forgotPasswordMailTrigger(req:Request,res:Response){
        const mailTrigger = await CustomerAuthDatabaseLayer.forgotPasswordMailTrigger(req);
        res.send(responseSuccess());
    }

    //forgot password with code verify
    static async forgotPasswordCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.forgotPasswordCodeVerification(req);
        res.send(responseSuccess());
    }
    //Switch Toogle
    static async inviteOnlyGenralSwitch(req: Request, res: Response) {
        var status = await CustomerAuthDatabaseLayer.inviteOnlyGenralSwitch(req);
        res.send(responseSuccess({result:status}));
    }

    
    static async getInviteOnlyGenralSwitch(req: Request, res: Response) {
        var status = await CustomerAuthDatabaseLayer.getInviteOnlyGenralSwitch(req);
        res.send(responseSuccess({result:status}));
    }
    static async signOut(req: Request, res: Response) {
        console.log('req',req);
        
        req.session = null;
        //TODO devcie Id remove
        res.send(responseSuccess());
    }
}