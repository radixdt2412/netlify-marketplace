import mongoose from 'mongoose';
import { app } from './app';
import { AttributeCreatedListener } from './event/listener/attribute-created-listener';
import { AttributeUpdateListener } from './event/listener/attribute-update-listener';
import { AttributeValueCreateListener } from './event/listener/attribute-value-create-listener';
import { AttributeValueUpdateListener } from './event/listener/attribute-value-update-listener';
import { BusinessCategoryCreatedListener } from './event/listener/business-category-listener';
import { BusinessCategoryUpdatedListener } from './event/listener/business-category-updated-listener';
import { BusinessRoleCreatedListener } from './event/listener/business-role-listener';
import { BusinessRoleMappingListener } from './event/listener/business-role-mapping-listener';
import { BusinessSubCategoryCreatedListener } from './event/listener/business-sub-category-listener';
import { BusinessSubCategoryUpdatedListener } from './event/listener/business-sub-category-update-listener';
import { BusinessUserCreatedListener } from './event/listener/business-user-listener';
import { CouponCreatedListener } from './event/listener/coupon-created-listener';
import { CouponMappingCreatedListener } from './event/listener/coupon-mapping-created';
import { CustomerAddressCreatedListener } from './event/listener/customer-address-listener';
import { CustomerCreatedListener } from './event/listener/customer-listener';
import { ProductCategoryCreatedListener } from './event/listener/product-category-created-listener';
import { ProductCreatedListener } from './event/listener/product-create-listener';
import { ProductItemCreatedListener } from './event/listener/product-item-listener';
import { ProductSKUSListener } from './event/listener/product-skus-created-listener';
import { ProductSKUsUpdateListener } from './event/listener/product-skus-update-listener';
import { ProductSubCategoryCreatedListener } from './event/listener/product-sub-category-created-listener';
import { ProductUpdateListener } from './event/listener/product-update-listener';
import { ProductVariantListener } from './event/listener/product-variant-created-listener';
import { StoreCreatedListener } from './event/listener/store-listener';
import { ProductVariantCombination } from './models/product-variant-combination';
import { natsWrapper } from './nats-wrapper';

const port = 3003;

const start = async () => {
  
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URI) {
    throw new Error('NATS_URII must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsWrapper.client.on('close', () => {
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    mongoose.set('strictQuery', false)
    await mongoose.connect((process.env.MONGO_URI).trim());

    new BusinessRoleCreatedListener(natsWrapper.client).listen()
    new BusinessRoleMappingListener(natsWrapper.client).listen()
    new BusinessUserCreatedListener(natsWrapper.client).listen()
    new StoreCreatedListener(natsWrapper.client).listen()
    new CustomerCreatedListener(natsWrapper.client).listen()
    new ProductCreatedListener(natsWrapper.client).listen()
    new ProductItemCreatedListener(natsWrapper.client).listen()
    new CustomerAddressCreatedListener(natsWrapper.client).listen()
    new CouponCreatedListener(natsWrapper.client).listen()
    new CouponMappingCreatedListener(natsWrapper.client).listen()
    new ProductSubCategoryCreatedListener(natsWrapper.client).listen()
    new ProductCategoryCreatedListener(natsWrapper.client).listen()
    new BusinessSubCategoryUpdatedListener(natsWrapper.client).listen();
    new BusinessCategoryUpdatedListener(natsWrapper.client).listen();
    new BusinessCategoryCreatedListener(natsWrapper.client).listen();
    new BusinessSubCategoryCreatedListener(natsWrapper.client).listen();
    new AttributeCreatedListener(natsWrapper.client).listen();
    new AttributeUpdateListener(natsWrapper.client).listen();
    new AttributeValueUpdateListener(natsWrapper.client).listen();
    new AttributeValueCreateListener(natsWrapper.client).listen();
    new ProductUpdateListener(natsWrapper.client).listen();
    new ProductSKUSListener(natsWrapper.client).listen();
    new ProductVariantListener(natsWrapper.client).listen();
    new ProductSKUsUpdateListener(natsWrapper.client).listen();
    
  } catch (error: any) {
    throw Error(error);
  }

  app.listen(port,()=>{
    console.log('listen at',port);
    
  });
};

start();
