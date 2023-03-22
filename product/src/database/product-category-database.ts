import { BadRequestError } from '@rx-marketplace/common';
import { ProductCategoryCreatedPublisher } from '../event/publisher/product-category-publisher';

import { AdminRoleMapping } from '../models/admin-role-mapping';
import { Admin } from '../models/admin';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from '../models/business-sub-category';
import { ProductCategory } from "../models/product-category";
import { ProductSubCategory } from '../models/product-sub-category';
import { natsWrapper } from '../nats-wrapper';

export class ProductCategoryDatabaseLayer {

    static async createProductCategory(req: any) {
        const { name, description, businessSubCategoryId,imageUrl } = req.body;
        const businessSubCategoryCheck = await BusinessSubCategory.findOne({$and:[{_id:businessSubCategoryId},{isActive:true}]});
        if (businessSubCategoryCheck) {
            const data = ProductCategory.build({
                name: name,
                description: description,
                isActive: true,
                businessSubCategoryId: businessSubCategoryId,
                imageUrl: imageUrl
            });
            console.log("completed, data",data);
            await data.save();
            await new ProductCategoryCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                name: data.name,
                description:data.name,
                isActive: data.isActive,
                businessSubCategoryId: data.businessSubCategoryId.toString()
            })
            return data;
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async updateProductCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const businessSubCategoryCheck = await BusinessSubCategory.findOne({$and:[{_id:req.body.businessSubCategoryId},{isActive:true}]});
        const data= await ProductCategory.findById(id);
        if (businessSubCategoryCheck && data) {
            try {
                await ProductCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, businessSubCategoryId: req.body.businessSubCategoryId, updateAt: updatedAt });
                console.log('completed');
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided Category id is not valid');
        }
    }

    static async deleteProductCategory(id: string) {
        try {
            const data=await ProductCategory.findById(id).populate('businessSubCategoryId');
            if(data){
                if(data.businessSubCategoryId.isActive==false){
                    throw new BadRequestError('parent category is inactive so not possible to active this category')
                }
                const status=data.isActive ? false : true;
                await ProductCategory.findByIdAndUpdate(id,{isActive:status});
                await ProductSubCategory.updateMany({productCategoryId:id},{$set:{isActive:status}});
                console.log('completed');
                return;
            }else{
                throw new BadRequestError('Data not found for given id');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getProductCategoryList(req: any) {
        const data = await ProductCategory.find({},{ productCategoryId: '$_id', _id: 0, name: 1, description: 1, imageUrl: 1 })
        console.log('completed data',data);
        return data;
    }
    
    static async getProductCategoryId(req: any,id:any) {
        const data=await ProductCategory.findById(id).populate({
            path: 'businessSubCategoryId', populate: {
                path: 'businessCategoryId'
            }
        });
        if(data){
            console.log('completed data',data);
            return data;
        }else{
            throw new BadRequestError('Data not found for given id');
        }
    }
    
    static async getBusinessCategoryIdList(req: any,id:any) {
        const data = await ProductCategory.find({businessSubCategoryId:id})
            .populate({
                path: 'businessSubCategoryId', populate: {
                    path: 'businessCategoryId'
                }
            });
        console.log('completed data',data);
        return data;
    }

    static async categoryCheck(req:any):Promise<any>{
        const data = await Admin.findById(req.currentUser.id);
        var dataPermission:any;
        if(data?.isSuperAdmin==true){
            console.log('completed data',data);
            return data;
        }
        const roleData = await AdminRoleMapping.find({roleId:data?.roleId}).populate('permissionId')
        if(roleData){
            roleData.map((e:any)=>{
                if(e.permissionId.tableName=="category"){
                 dataPermission= e._id;
                }
            })
        }
        if(dataPermission){
            return dataPermission;
        }else{
            throw new BadRequestError('Not wrights of category table')
        }
    }
    static async getProductCategoryActiveList(req: any) {
        const data = await ProductCategory.find({isActive:true}).populate({
            path: 'businessSubCategoryId', populate: {
                path: 'businessCategoryId'
            }
        });
        console.log('completed data',data);
        return data;
    }
    
}