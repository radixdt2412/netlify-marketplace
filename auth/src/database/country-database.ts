import { BadRequestError } from '@rx-marketplace/common';
import { CountryCreatedPublisher } from '../events/publisher/country-publisher';
import { Country } from '../models/country';
import { natsWrapper } from '../nats-wrapper';

export class CountryDatabaseLayer {

    static async createCountry(req: any) {
        const { countryName } = req.body;
        try {
            const data = Country.build({ countryName: countryName });
            await data.save();
            await new CountryCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                countryName: data.countryName
            })
            return data;
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }

    static async updateCountry(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            const data = await Country.findById(id);
            if (data) {
                await Country.findByIdAndUpdate(id, { countryName: req.body.countryName, isActive: req.body.isActive, update_at: updated_at });
                return;
            } else {
                throw new BadRequestError('given id is not exist in db');
            }
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteCountry(id: string) {
        try {
            const countryData = await Country.findById(id)
            if (countryData) {
                const status = countryData?.isActive ? false : true;
                await Country.findByIdAndUpdate(id, { isActive: status });
                return;
            } else {
                throw new BadRequestError('given id is not exist in db');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getCountryList(req: any) {
        const data = await Country.find();
        return data;
    }

    static async getCountryActiveList(req: any) {
        const data = await Country.find({ isActive: true });
        return data;
    }
    static async getCountryDeactiveList(req: any) {
        const data = await Country.find({ isActive: false });
        return data;
    }
    static async getCountryNameBasedSerch(name: string) {
        const data = await Country.find({$and:[{ countryName: { $regex: name + '.*', $options: 'i' } },{ isActive: true }]})
        return data;
    }

}