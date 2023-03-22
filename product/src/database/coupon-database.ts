import { BadRequestError } from '@rx-marketplace/common';
import mongoose, { Mongoose } from 'mongoose';
import shortid from 'shortid';
import { CouponMappingCreatedPublisher } from '../event/publisher/coupon-mapping-publisher';
import { CouponCreatedPublisher } from '../event/publisher/coupon-publsher';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Coupon } from '../models/coupon';
import { CouponMapping } from '../models/coupon-mapping';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';
import { ProductSubCategory } from '../models/product-sub-category';
import { Store } from '../models/store';
import { natsWrapper } from '../nats-wrapper';

export class CouponDatabaseLayer {

    static async createCoupon(req: any) {
        const productID: any[] = [];
        const customerID: any[] = [];
        const productCategoryID: any[] = [];
        const productSubCategoryID: any[] = [];
        const storeID: any[] = [];
        const { name, discountPercentage, repeatCoupon, maxUserLimit, minOrderAmount, maxDiscountAmount, createdFor, startDate, endDate, isMonthlyActive, couponAuthor, description, imageUrl, productId, customerId, productCategoryId, productSubCategoryId, storeId } = req.body;

        var permission = false;

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findOne({ $and: [{ _id: req.currentUser.id }, { isActive: true }] });

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isCreate == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
            const code = shortid.generate();
            const CouponData = Coupon.build({
                name: name,
                discountPercentage: discountPercentage,
                couponCode: code,
                isRepeatCoupon: repeatCoupon,
                maxUserLimit: maxUserLimit,
                maxDiscountAmount: maxDiscountAmount,
                createdFor: createdFor,
                startDate: startDate,
                endDate: endDate,
                isMonthlyActive: isMonthlyActive,
                couponAuthor: req.currentUser.type,
                imageUrl: imageUrl,
                isActive: true,
                description: description,
                minOrderAmount: minOrderAmount
            });
            if (productId != null && productId != undefined && productId.length != 0) {
                console.log('you are safe productId');
                await Promise.all(productId.map(async (e: any) => {
                    const productData = await Product.findOne({ _id: e });
                    if (!productData) {
                        throw new BadRequestError("Product id is not valid pls check it first " + e);
                    }
                    if (!productID.includes(productData.id)) {
                        productID.push(productData.id);
                    } else {
                        throw new BadRequestError("product id is in repeating state");
                    }
                    const CouponMappingData = CouponMapping.build({
                        couponId: CouponData.id,
                        isProduct: true,
                        isCustomer: false,
                        isStore: false,
                        isProductCategory: false,
                        isProductSubCategory: false,
                        baseId: e,
                    })
                    CouponMappingData.save();
                    await new CouponMappingCreatedPublisher(natsWrapper.client).publish({
                        id: CouponMappingData.id,
                        couponId: CouponMappingData.couponId,
                        isProduct: CouponMappingData.isProduct,
                        isCustomer: CouponMappingData.isCustomer,
                        isStore: CouponMappingData.isStore,
                        isProductCategory: CouponMappingData.isProductCategory,
                        isProductSubCategory: CouponMappingData.isProductSubCategory,
                        baseId: CouponMappingData.baseId
                    })
                }))

            }

            if (customerId != null && customerId != undefined && customerId.length != 0) {
                console.log('you are safe customerId');
                await Promise.all(customerId.map(async (e: any) => {
                    const customerData = await Customer.findOne({ _id: e });
                    if (!customerData) {
                        throw new BadRequestError("Cusotmer id is not valid pls check it first " + e);
                    }
                    if (!customerID.includes(customerData.id)) {
                        customerID.push(customerData.id);
                    } else {
                        throw new BadRequestError("Cusotmer id is in repeating state");
                    }
                    const CouponMappingData = CouponMapping.build({
                        couponId: CouponData.id,
                        isProduct: false,
                        isCustomer: true,
                        isStore: false,
                        isProductCategory: false,
                        isProductSubCategory: false,
                        baseId: e,
                    })
                    await CouponMappingData.save();

                    await new CouponMappingCreatedPublisher(natsWrapper.client).publish({
                        id: CouponMappingData.id,
                        couponId: CouponMappingData.couponId,
                        isProduct: CouponMappingData.isProduct,
                        isCustomer: CouponMappingData.isCustomer,
                        isStore: CouponMappingData.isStore,
                        isProductCategory: CouponMappingData.isProductCategory,
                        isProductSubCategory: CouponMappingData.isProductSubCategory,
                        baseId: CouponMappingData.baseId,
                    })
                }))
            }

            if (productCategoryId != null && productCategoryID != undefined && productCategoryId.length != 0) {
                console.log('you are safe productCategory');
                await Promise.all(productCategoryId.map(async (e: any) => {
                    const productCategoryData = await ProductCategory.findOne({ _id: e });
                    if (!productCategoryData) {
                        throw new BadRequestError("ProductCategory id is not valid pls check it first " + e);
                    }
                    if (!productCategoryID.includes(productCategoryData.id)) {
                        productCategoryID.push(productCategoryData.id);
                    } else {
                        throw new BadRequestError("ProductCategory id is in repeating state");
                    }
                    const CouponMappingData = CouponMapping.build({
                        couponId: CouponData.id,
                        isProduct: false,
                        isCustomer: false,
                        isStore: false,
                        isProductCategory: true,
                        isProductSubCategory: false,
                        baseId: e
                    })

                    await CouponMappingData.save();

                    await new CouponMappingCreatedPublisher(natsWrapper.client).publish({
                        id: CouponMappingData.id,
                        couponId: CouponMappingData.couponId,
                        isProduct: CouponMappingData.isProduct,
                        isCustomer: CouponMappingData.isCustomer,
                        isStore: CouponMappingData.isStore,
                        isProductCategory: CouponMappingData.isProductCategory,
                        isProductSubCategory: CouponMappingData.isProductSubCategory,
                        baseId: CouponMappingData.baseId,
                    })
                }))
            }

            if (productSubCategoryId != null && productSubCategoryId != undefined && productSubCategoryId.length != 0) {
                console.log('you are safe productSubCategory');
                await Promise.all(productSubCategoryId.map(async (e: any) => {
                    const productSubCategoryData = await ProductSubCategory.findOne({ _id: e });
                    if (!productSubCategoryData) {
                        throw new BadRequestError("productSubCategory id is not valid pls check it first " + e);
                    }
                    if (!productSubCategoryID.includes(productSubCategoryData.id)) {
                        productSubCategoryID.push(productSubCategoryData.id);
                    } else {
                        throw new BadRequestError("productSubCategory id is in repeating state");
                    }
                    const CouponMappingData = CouponMapping.build({
                        couponId: CouponData.id,
                        isProduct: false,
                        isCustomer: false,
                        isStore: false,
                        isProductCategory: false,
                        isProductSubCategory: true,
                        baseId: e
                    })
                    await CouponMappingData.save();
                    await new CouponMappingCreatedPublisher(natsWrapper.client).publish({
                        id: CouponMappingData.id,
                        couponId: CouponMappingData.couponId,
                        isProduct: CouponMappingData.isProduct,
                        isCustomer: CouponMappingData.isCustomer,
                        isStore: CouponMappingData.isStore,
                        isProductCategory: CouponMappingData.isProductCategory,
                        isProductSubCategory: CouponMappingData.isProductSubCategory,
                        baseId: CouponMappingData.baseId,
                    })
                }))
            }

            if (storeId != null && storeId != undefined && storeId.length != 0) {
                console.log('you are safe productSubCategory');
                if (req.currentUser.type == "Admin") {
                    await Promise.all(storeId.map(async (e: any) => {
                        const storeData = await Store.findOne({ _id: e });
                        if (!storeData) {
                            throw new BadRequestError("productSubCategory id is not valid pls check it first " + e);
                        }
                        if (!storeID.includes(storeData.id)) {
                            storeID.push(storeData.id);
                        } else {
                            throw new BadRequestError("productSubCategory id is in repeating state");
                        }
                        const CouponMappingData = CouponMapping.build({
                            couponId: CouponData.id,
                            isProduct: false,
                            isCustomer: false,
                            isStore: true,
                            isProductCategory: false,
                            isProductSubCategory: false,
                            baseId: e
                        })
                        CouponMappingData.save();
                        await new CouponMappingCreatedPublisher(natsWrapper.client).publish({
                            id: CouponMappingData.id,
                            couponId: CouponMappingData.couponId,
                            isProduct: CouponMappingData.isProduct,
                            isCustomer: CouponMappingData.isCustomer,
                            isStore: CouponMappingData.isStore,
                            isProductCategory: CouponMappingData.isProductCategory,
                            isProductSubCategory: CouponMappingData.isProductSubCategory,
                            baseId: CouponMappingData.baseId,
                        })
                    }))
                } else {
                    throw new BadRequestError("You are not able to create store coupon")
                }
            }
            await CouponData.save();
            await new CouponCreatedPublisher(natsWrapper.client).publish({
                id: CouponData.id,
                name: CouponData.name,
                discountPercentage: CouponData.discountPercentage,
                couponCode: CouponData.couponCode,
                isRepeatCoupon: CouponData.isRepeatCoupon,
                maxUserLimit: CouponData.maxUserLimit,
                maxDiscountAmount: CouponData.maxDiscountAmount,
                createdFor: CouponData.createdFor,
                startDate: CouponData.startDate,
                endDate: CouponData.endDate,
                isMonthlyActive: CouponData.isMonthlyActive,
                couponAuthor: CouponData.couponAuthor,
                imageUrl: CouponData.imageUrl,
                description: CouponData.description,
                minOrderAmount: CouponData.minOrderAmount,
                isActive: true
            })
            const data = Coupon.aggregate([
                { "$addFields": { "cId": { "$toString": "$_id" } } },
                { $match: { _id: new mongoose.Types.ObjectId(CouponData.id) } },
                {
                    $lookup: {
                        from: 'couponmappings',
                        localField: 'cId',
                        foreignField: 'couponId',
                        as: 'couponId'
                    }
                }
            ])
            console.log('completed data',data);
            return data;

        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async updateCoupon(req: any, id: string) {
        var permission = false;

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping:any = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isUpdate == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
            //TODO coupon update field pending
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async deleteCoupon(req: any, id: string) {
        var permission = false;
        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isDelete == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
            try {
                const data = await Coupon.findById(id)
                if (data) {
                    const status = data.isActive ? false : true;
                    await Coupon.findByIdAndUpdate(id, { isActive: status });
                    console.log('completed');
                    return;
                }else{
                    throw new BadRequestError("couponId is not valid");
                }
                
            } catch (error: any) {
                throw new BadRequestError(error.message);
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getCouponList(req: any) {
        const data = await Coupon.find()
        if (data) {
            console.log('completed data',data);
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getCouponActiveList(req: any) {
        const date = new Date();
        const data = await Coupon.find({ $and: [{ isActive: true }, { startDate: { "$gte": new Date() } }, { endDate: { '$gte': new Date() } }] })
        if (data) {
            console.log('completed data',data);
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getCouponDeactiveList(req: any) {
        const data = await Coupon.find({ isActive: false })
        if (data) {
            console.log('completed data',data);
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getMyCoupon(req: any) {

        const data = await CouponMapping.aggregate([
            { $match: { $and: [{ isCustomer: true }, { baseId: new mongoose.Types.ObjectId(req.currentUser.id) }] } },
            { $group: { _id : '$couponId' } }
        ]);

        const couponList:any[]=[];

        data.map((e:any)=>{
            couponList.push( new mongoose.Types.ObjectId(e._id));
        })
        
        const couponData= await Coupon.aggregate([{$match:{$and:[{_id:{$in:couponList}},{isActive:true}]}},
            {
                "$project": {
                    'couponId': '$_id',
                    '_id': 0,
                    "name": 1,
                    "description":1,
                    "startDate":1,
                    "endDate":1,
                    "couponCode":1,
                    "imageUrl":1,
                    "expiryOfCoupon": {
                      "$cond": { 
                        "if":  { $and:[ {$lte: ['$startDate',new Date()]},  {$lte:['$endDate',new Date()]} ]},
                        "then": "expired",
                        "else": {
                            "$cond": { 
                                "if":  { $and:[ {$lte: ['$startDate',new Date()]},  {$gte:['$endDate',new Date()]} ]},
                                "then": "ongoing",
                                "else": "upcoming",
                        }
                      }
                    }
                  }
                }
            }
        ]);
        console.log('completed data',couponData);
        return couponData;
        
    }

}