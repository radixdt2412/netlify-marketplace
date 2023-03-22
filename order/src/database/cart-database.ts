import { BadRequestError } from '@rx-marketplace/common'
import e from 'express';
import mongoose from 'mongoose';
import { Attribute } from '../models/attribute';
import { AttributeValue } from '../models/attribute-value';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { SKUS } from '../models/product-skus';
import { ProductVariantCombination } from '../models/product-variant-combination';

export class CartDatabaseLayer {
    
    static async removeSignleCart(req: any, id: any) {
        const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
        const cartPrep: any[] = [];
        if (currentUserCart) {
            currentUserCart.cartList.forEach((e: any) => {
                if (e.productId != id) {
                    cartPrep.push(e);
                }
            })
            await Cart.findOneAndUpdate({ customerId: req.currentUser.id }, {
                cartList: cartPrep
            });
            const cartData = await Cart.findOne({ customerId: req.currentUser.id });
            console.log('completed');
            return cartData;
        } else {
            throw new BadRequestError("Cart Not Found");
        }
    }

    static async removeCart(req: any) {
        const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
        if (currentUserCart) {
            await Cart.findOneAndDelete({ customerId: req.currentUser.id })
            console.log('completed');
            return;
        } else {
            throw new BadRequestError("Cart Not Found");
        }
    }

    static async removeProductCart(req: any) {
        const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
        if (currentUserCart) {
            const { productId, productItemId } = req.body;
           const data = await Cart.updateOne({ $and: [{ customerId: req.currentUser.id }, { 'cartList.productId': productId }, { 'cartList.productItemId': productItemId }] }, { $pull: { cartList: { $and: [{ productId: productId }, { productItemId: productItemId }] } } });
           
           if(data.modifiedCount===0){
            throw new BadRequestError("remove product is not possible");
           }else{

            console.log('completed');
             return;
           }
           
        } else {
            throw new BadRequestError("Cart Not Found");
        }
    }

    static async getCart(req: any) {
        var totalAmount = 0;
        var totalDiscountedPrice = 0;
        var totalBasePrice = 0;
        var deliverCharges = 0;
        const data = await Cart.findOne({ customerId: req.currentUser.id });
        var result: any[] = [];
        if (data) {
            await Promise.all(data.cartList.map(async (e: any) => {
                if (e.productItemId === null || e.productItemId === undefined) {
                    const productData = await Product.aggregate([
                        { $match: { _id: e.productId } }, {
                            $project: {
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
                        }
                    ]);

                    const productStrData = JSON.parse(JSON.stringify(productData[0]));
                    productStrData.productItemId = null;
                    productStrData.attribute = null;
                    productStrData.originalPrice = productStrData.originalPrice * e.purchaseQuantity;
                    productStrData.discountedPrice = productStrData.discountedPrice * e.purchaseQuantity;
                    productStrData.payableAmount = productStrData.originalPrice - productStrData.discountedPrice
                    totalDiscountedPrice = totalDiscountedPrice + productStrData.discountedPrice;
                    totalBasePrice = totalBasePrice + productStrData.originalPrice
                    productStrData.productImage = productStrData.imageUrl[0]
                    delete productStrData.imageUrl;
                    productStrData.qty = e.purchaseQuantity;
                    result.push(productStrData);
                } else {


                    const skuProductData = await SKUS.findOne({ $and: [{ productId: e.productId }, { _id: e.productItemId }] })
                    if (skuProductData) {
                        const productData = await Product.aggregate([
                            { $match: { _id: e.productId } }, {
                                $project: {
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
                            }
                        ]);
                        
                        const productStrData = JSON.parse(JSON.stringify(productData[0]));
                        productStrData.productItemId = skuProductData._id;
                        productStrData.discountedPrice = productStrData.discountedPrice * e.purchaseQuantity;
                        //attribute logic
                        const attributeData = await ProductVariantCombination.aggregate([
                            { $match: { productSKUsId: skuProductData._id } },
                            {
                                "$lookup": {
                                    "from": "attributevalues",
                                    "let": { "avId": '$attributeValueId' },
                                    "pipeline": [
                                        { "$match": { "$expr": { "$eq": ["$_id", "$$avId"] } } },
                                        {
                                            "$lookup": {
                                                "from": "attributes",
                                                "let": { "aId": '$attributeId' },
                                                "pipeline": [
                                                    { "$match": { "$expr": { "$eq": ["$_id", "$$aId"] } } },

                                                ],
                                                "as": "attributeData"
                                            }
                                        }
                                    ],
                                    "as": "attributevaluesData"
                                }
                            },
                            {
                                $project: {

                                    "createdAt": 0,
                                    "updatedAt": 0,
                                    "__v": 0,

                                    "_id": 0,
                                    "productSKUsId": 0,
                                    "attributeId": 0,
                                    "attributevaluesData.__v": 0,
                                    "attributevaluesData.createdAt": 0,
                                    "attributevaluesData.updatedAt": 0,
                                    "attributevaluesData.isActive": 0,
                                    "attributevaluesData._id": 0,

                                    "attributevaluesData.attributeData.__v": 0,
                                    "attributevaluesData.attributeData.createdAt": 0,
                                    "attributevaluesData.attributeData.updatedAt": 0,
                                    "attributevaluesData.attributeData.isActive": 0,
                                    "attributevaluesData.attributeData._id": 0,
                                }
                            }
                        ])

                        var attributeArr: any[] = [];

                        attributeData.map((c: any) => {
                            attributeArr.push(c.attributevaluesData);
                        })

                        productStrData.attribute = attributeData;
                        productStrData.productImage = productStrData.imageUrl[0]
                        productStrData.qty = e.purchaseQuantity;
                        if (skuProductData.isVariantBasedPrice) {
                            productStrData.originalPrice = (productStrData.originalPrice + skuProductData.price) * e.purchaseQuantity;
                        } else {
                            productStrData.originalPrice = productStrData.originalPrice * e.purchaseQuantity;
                        }
                        productStrData.payableAmount = productStrData.originalPrice - productStrData.discountedPrice
                        totalDiscountedPrice = totalDiscountedPrice + productStrData.discountedPrice;
                        totalBasePrice = totalBasePrice + productStrData.originalPrice
                        delete productStrData.imageUrl;
                        result.push(productStrData);
                    } else {
                        throw new BadRequestError("skuProductData not found")
                    }
                }
            }))
            totalAmount = totalBasePrice - totalDiscountedPrice;
            console.log('completed');
            return { grandTotal: totalAmount, totalPrice: totalBasePrice, totalDiscountedPrice: totalDiscountedPrice, deliveryCharges: deliverCharges, products: result } ;
        } else {
            return "Oh No!! Your cart is empty";
        }

    }

    static async createCart(req: any) {
        const { productId, productItemId, purchaseQuantity } = req.body;

        if (productItemId === undefined || productItemId === null) {
            const productCheck = await Product.findById(productId);
            const productSkusCheck = await SKUS.findOne({ productId: productId });
            if (productSkusCheck) {
                throw new BadRequestError("pls pass productItemId");
            } else {
                if (productCheck) {
                    if (productCheck.quantity > purchaseQuantity) {
                        //cart check
                        const cartCheck = await Cart.findOne({ customerId: new mongoose.Types.ObjectId(req.currentUser.id) })
                        const cartStr = JSON.parse(JSON.stringify(cartCheck));
                        var cartPrep: { productId: mongoose.Types.ObjectId, productItemId?: mongoose.Types.ObjectId | null, purchaseQuantity: number }[] = [];
                        var flag = false;
                        if (cartCheck) {
                            //already cart created so check
                            await Promise.all(cartStr.cartList.map((e: any) => {

                                if (e.productId === productId && (e.productItemId === null || e.productItemId === undefined)) {

                                    flag = true;
                                    // if (productCheck.quantity > (e.purchaseQuantity + purchaseQuantity)) {
                                        e.purchaseQuantity =  purchaseQuantity;
                                    // } else {
                                    //    return "You ask for more quantity";
                                    // }
                                }
                                cartPrep.push({ productId: new mongoose.Types.ObjectId(e.productId), purchaseQuantity: e.purchaseQuantity, productItemId: (e.productItemId === null || e.productItemId === undefined) ? null : new mongoose.Types.ObjectId(e.productItemId) })
                            }))
                            
                            if (flag == false) {
                                cartPrep.push({ productId: new mongoose.Types.ObjectId(productId), purchaseQuantity: purchaseQuantity });
                            }

                            const cartUpdate = await Cart.findOneAndUpdate({ customerId: new mongoose.Types.ObjectId(req.currentUser.id) }, { cartList: cartPrep })
                            return;
                        } else {
                            const cartData = Cart.build({ customerId: req.currentUser.id, cartList: [{ productId: productId, purchaseQuantity: purchaseQuantity }] });
                            await cartData.save();
                        }
                    } else {
                        throw new BadRequestError("You ask for more quantity");
                    }
                } else {
                    throw new BadRequestError("passed productId is not valid");
                }
            }
        } else {
            const productSkusCheck = await SKUS.findOne({ $and: [{ _id: productItemId }, { productId: productId }] });
            if (productSkusCheck) {
                if (productSkusCheck.qty > purchaseQuantity) {

                    //cart check
                    const cartCheck = await Cart.findOne({ customerId: new mongoose.Types.ObjectId(req.currentUser.id) })
                    const cartStr = JSON.parse(JSON.stringify(cartCheck));
                    var cartPrep: { productId: mongoose.Types.ObjectId, productItemId?: mongoose.Types.ObjectId | null, purchaseQuantity: number }[] = [];
                    var flag = false;
                    if (cartCheck) {
                        await Promise.all(cartStr.cartList.map((e: any) => {
                            if (e.productId === productId && e.productItemId === productItemId) {
                                flag = true;
                                // if (productSkusCheck.qty > (e.purchaseQuantity + purchaseQuantity)) {
                                    e.purchaseQuantity = purchaseQuantity;
                                // } else {
                                //     return "You ask for more quantity";
                                // }
                            }

                            cartPrep.push({ productId: new mongoose.Types.ObjectId(e.productId), purchaseQuantity: e.purchaseQuantity, productItemId: (e.productItemId === null || e.productItemId === undefined) ? null : new mongoose.Types.ObjectId(e.productItemId) })

                        }))
                        if (flag == false) {
                            cartPrep.push({ productId: new mongoose.Types.ObjectId(productId), productItemId: new mongoose.Types.ObjectId(productItemId), purchaseQuantity: purchaseQuantity });
                        }

                        const cartUpdate = await Cart.findOneAndUpdate({ customerId: new mongoose.Types.ObjectId(req.currentUser.id) }, { cartList: cartPrep })
                        return;
                    } else {
                        const cartData = Cart.build({ customerId: req.currentUser.id, cartList: [{ productId: productId, productItemId: productItemId, purchaseQuantity: purchaseQuantity }] });
                        await cartData.save();
                        return;
                    }
                } else {
                    throw new BadRequestError("You ask for more quantity");
                }
            } else {
                throw new BadRequestError("Id is not matched")
            }
        }
        return;
    }
}