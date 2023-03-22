import { BadRequestError } from '@rx-marketplace/common';
import { CustomerAddressCreatedPublisher } from '../events/publisher/customer-address-publisher';
import { City } from '../models/city';
import { Country } from '../models/country';
import { customerAddress } from '../models/customer-address';
import { State } from '../models/state';
import { natsWrapper } from '../nats-wrapper';

export class CustomerAddressDatabaseLayer {

    static async createAddress(req: any) {
        var { phoneNumber, addressType, isDefault, addressLine1, addressLine2, cityId, stateId, countryId, zipCode } = req.body;
        const countryCheck = await Country.findById(countryId);
        const stateCheck = await State.findById(stateId);
        const cityCheck = await City.findById(cityId);
        
        if (countryCheck && stateCheck && cityCheck) {

            if (isDefault == true) {
                const data = await customerAddress.findOneAndUpdate({ $and: [{ customerId: req.currentUser.id }, { isDefalultAddress: true }] }, { $set: { isDefalultAddress: false } });
            } else {
                const data = await customerAddress.find({ coustomerId: req.currentUser.id });
                if (data.length == 0) {
                    isDefault = true;
                }
            }

            const data = customerAddress.build({
                customerId: req.currentUser.id,
                phoneNumber: phoneNumber,
                addressType: addressType,
                isDefalultAddress: isDefault,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                cityId: cityId,
                stateId: stateId,
                countryId: countryId,
                zipCode: zipCode,
            })
            await data.save();
            await new CustomerAddressCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                customerId: data.customerId,
                phoneNumber: data.phoneNumber,
                addressType: data.addressType,
                isDefalultAddress: data.isDefalultAddress,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                cityId: data.cityId.toString(),
                stateId: data.stateId.toString(),
                countryId: data.countryId.toString(),
                zipCodes: zipCode
            })
            return data;
        } else {
            throw new BadRequestError('Givien id is not valid');
        }
    }

    static async updateAddress(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        if (req.body.isDefault == true) {
            const data = await customerAddress.findOne({ $and: [{ customerId: req.currentUser.id }, { isDefalultAddress: true }] });
            await customerAddress.findByIdAndUpdate(data?._id, { isDefaultAddress: false });

        }
        try {
            await customerAddress.findByIdAndUpdate(id, {
                phoneNumber: req.body.phoneNumber,
                addressType: req.body.addressType,
                isDefalultAddress: req.body.isDefault,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                cityId: req.body.cityId,
                stateId: req.body.stateId,
                countryId: req.body.countryId,
                updated_at: updated_at
            });

            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }

    }

    static async deleteAddress(id: string) {
        try {
            await customerAddress.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getCurrentUserAddress(req: any) {
        const data = await customerAddress.find({ customerId: req.currentUser.id }, { stateId: 0, countryId: 0 }).populate({
            path: 'cityId', populate: {
                path: 'stateId', populate: {
                    path: 'countryId'
                }
            }
        });
        return data
    }

}