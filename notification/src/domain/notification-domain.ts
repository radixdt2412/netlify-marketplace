import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationDatabaseLayer } from '../database/notification-database';

export class NotificationDomain{
 static async brodcastNotification(req:Request,res:Response){
    var isPermissionAdded = await NotificationDatabaseLayer.brodcastNotification(req);
    res.send(responseSuccess({ result: isPermissionAdded }));
 }  
}