import { SalesItems } from './../entities/SalesItems';
import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';

export class SalesItemsController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const salesItemsData = req.body;
            const salesItem = await AppDataSource.getRepository(SalesItems).save(salesItemsData);
            if (!salesItem) {
                return res.status(400).json({
                    msg: 'An unexpected error occurred',
                });
            }
            return res.status(200).json({
                msg: 'Create sales item sucessfully',
                data: salesItem,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getSalesItemsByOrderId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { order_id } = req.params;
            const salesItems = await AppDataSource.getRepository(SalesItems)
                .createQueryBuilder('sales_items')
                .where('sales_items.order_id = :order_id', {
                    order_id,
                })
                .getMany();

            if (!salesItems) {
                return res.status(404).json({
                    success: false,
                    msg: 'Sales item you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get sales items success',
                data: salesItems,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
