import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';
import { Orders } from '../entities';

export class OrdersController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const orderData = req.body;
            const order = await AppDataSource.getRepository(Orders).save(orderData);
            if (!order) {
                return res.status(400).json({
                    msg: 'An unexpected error occurred',
                });
            }
            return res.status(200).json({
                msg: 'Create order sucessfully',
                data: order,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getPendingOrdersByCustomerId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { id } = req.params;
            const orders = await AppDataSource.getRepository(Orders)
                .createQueryBuilder('orders')
                .where('orders.customer_id = :customer_id', {
                    customer_id: id,
                })
                .andWhere('orders.order_status = :status', {
                    status: 'Chờ xác nhận',
                })
                .getMany();

            if (!orders) {
                return res.status(200).json({
                    success: false,
                    msg: 'Orders you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get product success',
                data: orders,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getProcessingOrdersByCustomerId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { id } = req.params;
            const orders = await AppDataSource.getRepository(Orders)
                .createQueryBuilder('orders')
                .where('orders.customer_id = :customer_id', {
                    customer_id: id,
                })
                .andWhere('orders.order_status = :status', {
                    status: 'Đang giao',
                })
                .getMany();

            if (!orders) {
                return res.status(200).json({
                    success: false,
                    msg: 'Orders you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get product success',
                data: orders,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getDeliveredOrdersByCustomerId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { id } = req.params;
            const orders = await AppDataSource.getRepository(Orders)
                .createQueryBuilder('orders')
                .where('orders.customer_id = :customer_id', {
                    customer_id: id,
                })
                .andWhere('orders.order_status = :status', {
                    status: 'Hoàn thành',
                })
                .getMany();

            if (!orders) {
                return res.status(200).json({
                    success: false,
                    msg: 'Orders you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get product success',
                data: orders,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCancelledOrdersByCustomerId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { id } = req.params;
            const orders = await AppDataSource.getRepository(Orders)
                .createQueryBuilder('orders')
                .where('orders.customer_id = :customer_id', {
                    customer_id: id,
                })
                .andWhere('orders.order_status = :status', {
                    status: 'Đã hủy',
                })
                .getMany();

            if (!orders) {
                return res.status(200).json({
                    success: false,
                    msg: 'Orders you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get product success',
                data: orders,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
