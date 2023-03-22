import { BadRequestError } from '@rx-marketplace/common';
import mongoose from 'mongoose';
import { Product } from '../models/product';
import { ProductReview } from '../models/product-review';
import { ProductWhishlist } from '../models/whislist-product';


export class ProductWhishlistDatabaseLayer {

    static async createProductWhishlist(req: any) {
        const { productId } = req.body;
        const productCheck = await Product.findById(productId);
        if (productCheck) {
            const check= await ProductWhishlist.findOne({$and:[{productId: new mongoose.Types.ObjectId(productId)},{customerId:new mongoose.Types.ObjectId(req.currentUser.id)}]})
            if(!check){
            const data = ProductWhishlist.build({
                customerId: req.currentUser.id,
                productId: productId
            });
            await data.save();
            console.log('complete data',data);
            return data;
        }else{
            const data=await ProductWhishlist.findOneAndDelete({$and:[{productId: new mongoose.Types.ObjectId(productId)},{customerId:new mongoose.Types.ObjectId(req.currentUser.id)}]});
            return data;
        }
        } else {
            throw new BadRequestError('Provided productId is not valid');
        }
    }

    static async deleteProductWhishlist(id: string,req:any) {
        const data= await ProductWhishlist.findOne({$and:[{productId:new mongoose.Types.ObjectId(id)},{customerId:new mongoose.Types.ObjectId(req.currentUser.id)}]});
        if (data) {
            try {
                await ProductWhishlist.findOneAndRemove({$and:[{productId:new mongoose.Types.ObjectId(id)},{customerId:new mongoose.Types.ObjectId(req.currentUser.id)}]});
                console.log('complete data');
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided id is not valid');
        }
    }

    static async getProductWhishlistList(req: any) {
        const dataWhislist = await ProductWhishlist.find({customerId:new mongoose.Types.ObjectId(req.currentUser.id)});
        var productList:any[]=[];
        await Promise.all(dataWhislist.map((e)=>{
            productList.push(new mongoose.Types.ObjectId(e.productId));
        }))
        var pageSize: any = (req.query.pagesize);
        var page: any = (req.query.page);

        if ((pageSize === undefined || pageSize === null) && (page === undefined || page === null)) {
            throw new BadRequestError("PageSize and page is not passed in query params")
        }
        var totalPage: number;


        const data = await Product.aggregate([{ $match:  {_id:{$in:productList}} },
            {
                "$project": {
                    "productId": "$_id",
                    "productTitle": "$name",
                    "productShortDescription": "$description",
                    "originalPrice": "$basePrice",
                    "discountedPrice": "$discountedValue",
                    "discountPercentage": "$discount",
                    "imageUrl": 1,
                    "rating": 1,
                    "_id": 0
                }
            }]).skip((parseInt(pageSize) * (parseInt(page) - 1))).limit(parseInt(pageSize));
    
            totalPage = Math.round(dataWhislist.length / pageSize);
    
            if (data) {
                const dataStr = JSON.parse(JSON.stringify(data));
                await Promise.all(dataStr.map(async (e: any) => {
                    if (req.currentUser) { 
                        const wishData = await ProductWhishlist.findOne({ $and: [{ productId: new mongoose.Types.ObjectId(e.productId) }, { customerId: new mongoose.Types.ObjectId(req.currentUser.id) }] });
                        e.isInWishList = wishData ? true : false;
                    } else {
                        e.isInWishList = false;
                    }
                   
                        e.productIteamId = null;
                        e.productImage = e.imageUrl[0];
                    
    
                    const reviewData = await ProductReview.find({ productId: e.ProductId });
                    e.totalRating = reviewData.length;
    
                    delete e['imageUrl'];
                }))
                console.log('completed data',dataStr);
                return { total: totalPage, page: page, result: dataStr };
            } else {
                throw new BadRequestError("no data found for given id");
            }
    }

}