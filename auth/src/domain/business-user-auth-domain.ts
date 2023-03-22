import { BadRequestError } from "@rx-marketplace/common"
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { JwtService } from '../services/jwt';
import { BusinessUserAuthDatabaseLayer } from '../database/business-user-auth-database';
import { PayloadType } from '../services/string-values';
import { responseSuccess } from '@rx-marketplace/common';

// import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

export class BusinessDomain {

    // SIGNUP
    static async signUp(req: Request, res: Response) {

        const { email, phoneNumber } = req.body;
        var exitstingPhone;
        var existingUser
        if (email != undefined || email != null) {
            existingUser = await BusinessUserAuthDatabaseLayer.isExistingEmail(email);
        }
        if (phoneNumber != undefined || phoneNumber != null) {
            exitstingPhone = await BusinessUserAuthDatabaseLayer.isExistingPhone(phoneNumber);
        }

        if (existingUser) {
            throw new BadRequestError('Email In Use');
        }
        if (exitstingPhone) {
            throw new BadRequestError('Phone is Already in use');
        }

        var user = await BusinessUserAuthDatabaseLayer.signUpUser(req);
        const accessToken = await JwtService.accessToken({ email: user.email, id: user.id, phoneNumber: user.phoneNumber, type: PayloadType.Vendor });
        req.session = { jwt: accessToken };
        console.log('session',req.session);
        
        return res.send(responseSuccess({result:{ user: user, accessToken: accessToken }}));
    }

    //SIGNIN 
    static async signIn(req: Request, res: Response) {

        const { password } = req.body;
        var email: string, phoneNumber: Number, isEmail = false;

        var exitstingEmail: any, existingPhone: any;

        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            email = req.body.email;
            exitstingEmail = await BusinessUserAuthDatabaseLayer.isExistingEmail(email)
            isEmail = true;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            phoneNumber = req.body.phoneNumber;
            existingPhone = await BusinessUserAuthDatabaseLayer.isExistingPhone(phoneNumber)
        }


        if (isEmail && !exitstingEmail) {
            throw new BadRequestError('Invalid Email');
        }
        if (isEmail == false && !existingPhone) {
            throw new BadRequestError('Invalid PhoneNumber');
        }
        const passwordMatch = await BusinessUserAuthDatabaseLayer.checkPassword(
            isEmail ? exitstingEmail.password : existingPhone.password,
            password
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid Password');
        }

        if (exitstingEmail) {
            const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, type: PayloadType.Vendor });
            const newRefreshToken = await BusinessUserAuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
            req.session = { jwt: accessToken };
            console.log('session',req.session);
            return res.send({ accessToken: accessToken, refreshToken: newRefreshToken })
        } else if (existingPhone) {
            const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, type: PayloadType.Vendor });
            const newRefreshToken = await BusinessUserAuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
            req.session = { jwt: accessToken };
            console.log('session',req.session);
            return res.send(responseSuccess({result:{ accessToken: accessToken, refreshToken: newRefreshToken }}));
        }
    }


    //GET ALL USER DATA
    static async getAllUsers(req: Request, res: Response) {
        var customer = await BusinessUserAuthDatabaseLayer.getAllUsers();
        res.send(responseSuccess({result:customer}));
    }
    
    static async getAllActiveUsers(req: Request, res: Response) {
        var customer = await BusinessUserAuthDatabaseLayer.getAllActiveUsers();
        res.send(responseSuccess({result:customer}));
    }
    static async getAllDeActiveUsers(req: Request, res: Response) {
        var customer = await BusinessUserAuthDatabaseLayer.getAllDeActiveUsers();
        res.send(responseSuccess({result:customer}));
    }

    //GET USER BY ID
    static async getUserById(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const customer = await BusinessUserAuthDatabaseLayer.getUserById(req.params.id);
        if (!customer) {
            throw new BadRequestError("customer doesn't exist");
        }
        res.send(responseSuccess({result:customer}));
    }


    static async userGetWithThirRoles(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        console.log('id', req.params.id);

        const customer = await BusinessUserAuthDatabaseLayer.userGetWithThirRoles(req.params.id);

        res.send(responseSuccess({result:customer}));
    }

    //Delete user by Id
    static async deleteUserById(req: Request, res: Response) {

        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }

        const deletedCount = await BusinessUserAuthDatabaseLayer.deleteUserById(req.params.id);
        res.send(responseSuccess());
    }

    //Get User By name 
    static async getUserByName(req: Request, res: Response) {
        const customer = await BusinessUserAuthDatabaseLayer.getUserByName(req.params.name);
        res.send(responseSuccess({result:customer}));
    }

    //add user
    static async createUser(req: Request, res: Response) {
        const { email, phoneNumber } = req.body;
        var exitstingPhone;
        var existingUser
        if (email != undefined || email != null) {
            existingUser = await BusinessUserAuthDatabaseLayer.isExistingEmail(email);
        }
        if (phoneNumber != undefined || phoneNumber != null) {
            exitstingPhone = await BusinessUserAuthDatabaseLayer.isExistingPhone(phoneNumber);
        }

        if (existingUser) {
            throw new BadRequestError('Email In Use');
        }
        if (exitstingPhone) {
            throw new BadRequestError('Phone is Already in use');
        }

        const customer = await BusinessUserAuthDatabaseLayer.createUser(req);
        res.send(responseSuccess({result:customer}));
    }

    //currentLoginUSer
    static async currentLoginUser(req: Request, res: Response) {
        const currentUser = await BusinessUserAuthDatabaseLayer.currentLoginUser(req);
        res.send(responseSuccess({result:currentUser}));
    }

    //EmailVerification
    static async emailVerification(req: Request, res: Response) {
        const mailTrigger = await BusinessUserAuthDatabaseLayer.emailVerification(req);
        res.send(responseSuccess());
    }

    //mail verification code verify
    static async emailCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.emailCodeVerification(req);
        res.send(responseSuccess());
    }

    //Phone Verification
    static async phoneVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.phoneVerification(req);
        res.send(responseSuccess());
    }

    //phone verification code verify
    static async phoneCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.phoneCodeVerification(req);
        res.send(responseSuccess());
    }

    //email trigger for forgot password
    static async forgotPasswordMailTrigger(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.forgotPasswordMailTrigger(req);
        res.send(responseSuccess());
    }

    //forgot password with code verify
    static async forgotPasswordCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.forgotPasswordCodeVerification(req);
        res.send(responseSuccess());
    }

    static async roleMapping(req: Request, res: Response) {
        const data = await BusinessUserAuthDatabaseLayer.roleMapping(req, req.params.id);
        res.send(responseSuccess({result:data}));
    }

     // SIGN-OUT
     static async signOut(req: Request, res: Response) {
        req.session = null;
        res.send(responseSuccess());
    }
}