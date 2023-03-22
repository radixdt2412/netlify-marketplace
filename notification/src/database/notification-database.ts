import { BadRequestError } from '@rx-marketplace/common';
import * as admin from 'firebase-admin';
import mongoose from 'mongoose';
import credential from "../marketplace-5438b-firebase-adminsdk-i4wql-92b99d4176.json";
import { Notification } from "../models/notification";
import { NotificationTemplate } from '../models/notification-template';

admin.initializeApp(
    {
        credential: admin.credential.cert(JSON.parse(JSON.stringify(credential)))
    }
);

export class NotificationDatabaseLayer {  
    static async brodcastNotification(req:any){
      
        const data = await Notification.findById(req.body.id);
        if(data){
          const tempData = await NotificationTemplate.findById(data.notificationTemplateId);
          if(tempData){
            const message = {
                notification: {
                  title: tempData.title,
                  body: tempData.description,
                  imageUrl:tempData.imageUrl
                },
                topic:"Events",
               
              };
            
            const res = await admin.messaging().send(message);
          // return pending
          return res;
              
          }else{
            throw new BadRequestError("template id is not valid");
          }
      }else{
        throw new BadRequestError("id is not valid");
      }
    }
}
