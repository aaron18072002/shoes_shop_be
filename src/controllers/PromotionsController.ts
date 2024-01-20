import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';
import { Promotions } from '../entities';

export class PromotionsController {
    async getPromotionById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const promotion = await AppDataSource.getRepository(Promotions).findOneBy({ id });
            if (!promotion) {
                return res.status(404).json({
                    success: false,
                    msg: 'Promotion you are looking for does not exist',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get promotion success',
                data: promotion,
            });
        } catch (error) {
            throw new Error();
        }
    }
}
