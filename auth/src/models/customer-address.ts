import mongoose, { ObjectId } from 'mongoose';
import { CityDoc } from './city';
import { CountryDoc } from './country';
import { StateDoc } from './state';

interface customerAddressAttrs {
  customerId: string;
  phoneNumber: number;
  addressType: string;
  isDefalultAddress: boolean;
  addressLine1: string;
  addressLine2: string;
  cityId: string;
  stateId: string;
  countryId: string;
  zipCode: number;
}

interface customerAddressDoc extends mongoose.Document {
  customerId: string;
  phoneNumber: number;
  addressType: string;
  isDefalultAddress: boolean;
  addressLine1: string;
  addressLine2: string;
  cityId: CityDoc;
  stateId: StateDoc;
  countryId: CountryDoc;
  zipCode: number;
}

interface customerAddressModel extends mongoose.Model<customerAddressDoc> {
  build(attrs: customerAddressAttrs): customerAddressDoc;
}

const customerAddressSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerUser',required:true },
    phoneNumber: { type: Number },
    addressType: { type: String },
    isDefalultAddress: { type: Boolean },
    addressLine1: { type: String },
    addressLine2: { type: String },
    cityId: { type: mongoose.Schema.Types.ObjectId ,ref:'city' },
    stateId: { type: mongoose.Schema.Types.ObjectId , ref:'state'},
    countryId: { type: mongoose.Schema.Types.ObjectId , ref:'country'},
    zipCode: { type: Number },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  }
);

customerAddressSchema.pre('update', async function (done) {
  const currentDate = new Date();
  const updated_at = currentDate.getTime();
  this.set('updatedAt', updated_at);
  done();
})

customerAddressSchema.statics.build = (attrs: customerAddressAttrs) => {
  return new customerAddress(attrs);
};

const customerAddress = mongoose.model<customerAddressDoc, customerAddressModel>('CustomerAddress', customerAddressSchema);

export { customerAddress };
