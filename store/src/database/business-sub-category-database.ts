import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessSubCategoryCreatedPublisher } from '../event/publisher/business-sub-category-publisher';
import { BusinessSubCategoryUpdatePublisher } from '../event/publisher/business-sub-category-updated-publisher';
import { Admin } from '../models/admin';
import { AdminRoleMapping } from '../models/admin-role-mapping';

import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from "../models/business-sub-category";
import { natsWrapper } from '../nats-wrapper';

export class BusinessSubCategoryDatabaseLayer {

    static async createBusinessSubCategory(req: any) {
        const { name, description, businessCategoryId, imageUrl } = req.body;
        const businessCategoryCheck = await BusinessCategory.findOne({ $and: [{ _id: businessCategoryId }, { isActive: true }] });
        if (businessCategoryCheck) {
            const data = BusinessSubCategory.build({
                name: name,
                description: description,
                isActive: true,
                businessCategoryId: businessCategoryId,
                imageUrl: imageUrl
            });
            console.log(data);
            await data.save();
            await new BusinessSubCategoryCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                name: data.name,
                description: data.description,
                isActive: data.isActive,
                businessCategoryId: data.businessCategoryId.toString()
            })
            return data;
        } else {
            throw new BadRequestError('Provided business Category is not valid');
        }
    }

    static async updateBusinessSubCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const businessCategoryCheck = await BusinessCategory.findOne({ $and: [{ _id: req.body.businessCategoryId }, { isActive: true }] });
        const data = await BusinessSubCategory.findById(id);
        if (businessCategoryCheck && data) {
            try {
                await BusinessSubCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, businessCategoryId: req.body.businessCategoryId, update_at: updatedAt });
                console.log('completed');
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided business Category is not valid');
        }
    }

    static async deleteBusinessSubCategory(id: string) {
        try {
            const data = await BusinessSubCategory.findById(id).populate('businessCategoryId');
            if (data) {
                if (data.businessCategoryId.isActive == false) {
                    throw new BadRequestError('parent category is inactive so not possible to active this category')
                }
                const status = data.isActive ? false : true;
                await BusinessSubCategory.findByIdAndUpdate(id, { isActive: status });
                await new BusinessSubCategoryUpdatePublisher(natsWrapper.client).publish({
                    id: id,
                    name: data.name,
                    description: data.description,
                    isActive: status,
                    businessCategoryId: data.businessCategoryId.toString()
                })
                console.log('completed');
                return;
            } else {
                throw new BadRequestError('Data not found for given id');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessSubCategoryList(req: any) {
        const data = await BusinessSubCategory.find({}, {  categoryId: '$_id', _id: 0, categoryTitle:'$name', categoryImageUrl:'$imageUrl' })
        console.log('completed data', data);
        return data;
    }

    static async getBusinessSubCategoryId(req: any, id: any) {
        const data = await BusinessSubCategory.findById(id)
            .populate('businessCategoryId');
        if (data) {
            console.log('completed data', data);
            return data;
        } else {
            throw new BadRequestError('given id type no data found in DB')
        }
    }

    static async getBusinessSubCategoryActiveList(req: any) {
        const data = await BusinessSubCategory.find({ isActive: true })
            .populate('businessCategoryId');
        console.log('completed data', data);
        return data;
    }

    static async getBusinessCategoryIdList(req: any, id: any) {
        const data = await BusinessSubCategory.find({ businessCategoryId: id })
            .populate('businessCategoryId');
        if (data) {
            console.log('completed data', data);
            return data;
        } else {
            throw new BadRequestError('given id type no data found in DB')
        }
    }

    static async categoryCheck(req: any): Promise<any> {
        const data = await Admin.findById(req.currentUser.id);
        var dataPermission: any;
        if (data?.isSuperAdmin == true) {
            console.log('completed data', data);
            return data;
        }
        const roleData = await AdminRoleMapping.find({ roleId: data?.roleId }).populate('permissionId')
        if (roleData) {
            roleData.map((e: any) => {
                if (e.permissionId.tableName == "category") {
                    dataPermission = e._id;
                }
            })
        }
        if (dataPermission) {
            console.log('completed dataPermission', dataPermission);
            return dataPermission;
        } else {
            throw new BadRequestError('Not wrights of category table')
        }
    }
}