import { BadRequestError, } from '@rx-marketplace/common';
import { AttributeCreatedPublisher } from '../event/publisher/attribute-create-publisher';
import { AttributeUpdatePublisher } from '../event/publisher/attribute-update-publisher';
import { Attribute } from '../models/attribute';
import { natsWrapper } from '../nats-wrapper';


export class AttributeDatabaseLayer {

    static async createAttribute(req: any) {
        try {
            const {name,type}=req.body;
            const data=Attribute.build({name:name,type:type});
            await data.save();
            console.log('completed data',data);
            await new AttributeCreatedPublisher(natsWrapper.client).publish({
                id: data._id,
                name: data.name,
                type: data.type,
                isAcive: true
            })
            return data;
        } catch (error:any) {
            throw new BadRequestError(error.message);
        }        
    }

    static async updateAttribute(req: any, id: string) {
        const data= await Attribute.findById(id);
        const {name,}=req.body; 
        if(data){
            const attributeUpdate = await Attribute.findByIdAndUpdate(id,{name:name,});
            console.log('completed');
            await new AttributeUpdatePublisher(natsWrapper.client).publish({
                id:data.id,
                name:name,
                isAcive:true,
                type:data.type
            })
            return await Attribute.findById(id);
            
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async deleteAttribute(req: any, id: string) {
        const data= await Attribute.findById(id);
        var status = data?.isActive ? false : true;
        if(data){
            await Attribute.findByIdAndUpdate(id,{isActive:status});
            await new AttributeUpdatePublisher(natsWrapper.client).publish({
                id:data.id,
                name:data.name,
                isAcive:status,
                type:data.type
            })
            console.log('completed');
            return;
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async getAttributeList(req: any) {
        const data = await Attribute.find()
        if (data) {
            console.log('completed data',data);
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }



}