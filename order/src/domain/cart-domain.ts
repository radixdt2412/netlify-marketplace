import { BadRequestError, responseSuccess } from '@rx-marketplace/common';
import { Request, Response } from 'express';
import { CartDatabaseLayer } from '../database/cart-database';

export class CartDomain {

    static async createCart(req: Request, res: Response) {
        const Cart = await CartDatabaseLayer.createCart(req);
        res.send(responseSuccess({ result: Cart }));
    }

    static async removeCart(req: Request, res: Response) {
        await CartDatabaseLayer.removeCart(req);
        res.send(responseSuccess({ result: { deleted: true } }));
    }

    static async removeProductCart(req: Request, res: Response) {
        const d = await CartDatabaseLayer.removeProductCart(req);
        res.send(responseSuccess({ result: d }));
    }

    static async getCart(req: Request, res: Response) {
        const Cart = await CartDatabaseLayer.getCart(req);
        res.send(responseSuccess({ result: Cart }));
    }

}