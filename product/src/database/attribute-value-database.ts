import { BadRequestError } from '@rx-marketplace/common';
import { AttributeValueCreatedPublisher } from '../event/publisher/attribute-value-create-publisher';
import { AttributeValueUpdatePublisher } from '../event/publisher/attribute-value-update-publisher';
import { Attribute } from '../models/attribute';
import { AttributeValue } from '../models/attribute-value';
import { natsWrapper } from '../nats-wrapper';


export class AttributeValueDatabaseLayer {

    static async createAttributeValue(req: any) {
        try {
            const { value,attributeId}=req.body;
            const attributeCheck = await Attribute.findById(attributeId);
            if(attributeCheck){
            const data=AttributeValue.build({value:value,attributeId:attributeId});
            await data.save();
            await new AttributeValueCreatedPublisher(natsWrapper.client).publish({attributeId:attributeId,id:data.id,isAcive:true,value:data.value});
            console.log('completed data',data);
            return data;
            }else{
                throw new BadRequestError("Attribute Id is not exist")
            }
        } catch (error:any) {
            throw new BadRequestError(error.message);
        }        
    }

    static async updateAttributeValue(req: any, id: string) {
        const data= await AttributeValue.findById(id);
        const { value,attributeId}=req.body;
        if(data){
            const AttributeValueUpdate = await AttributeValue.findByIdAndUpdate(id,{value:value,attributeId:attributeId});
            await new AttributeValueUpdatePublisher(natsWrapper.client).publish({attributeId:attributeId,id:data.id,isAcive:true,value:value});
            console.log('completed');
            return await AttributeValue.findById(id);
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async deleteAttributeValue(req: any, id: string) {
        const data= await AttributeValue.findById(id);
        var status = data?.isActive ? false : true;
        if(data){
            await AttributeValue.findByIdAndUpdate(id,{isActive:status});
            await new AttributeValueUpdatePublisher(natsWrapper.client).publish({attributeId:data.attributeId.toString(),id:data.id,isAcive:true,value:data.value});
            console.log('completed');
            return;
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async getAttributeValueList(req: any) {
        const data = await AttributeValue.find().populate('attributeId')
        if (data) {
            console.log('completed data',data);
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }
    
}