import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AttributeValueDatabaseLayer } from '../database/attribute-value-database';

export class AttributeValueDomain {

    static async createAttributeValue(req: Request, res: Response) {
        const AttributeValue = await AttributeValueDatabaseLayer.createAttributeValue(req);
        res.send(responseSuccess({ result: AttributeValue }));
    }

    static async updateAttributeValue(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await AttributeValueDatabaseLayer.updateAttributeValue(req, req.params.id);
        res.send(responseSuccess({ result: data }));
    }

    static async deleteAttributeValue(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await AttributeValueDatabaseLayer.deleteAttributeValue(req, req.params.id);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async getAttributeValueList(req: Request, res: Response) {
        const AttributeValue = await AttributeValueDatabaseLayer.getAttributeValueList(req);
        res.send(responseSuccess({ result: AttributeValue }));
    }

}
