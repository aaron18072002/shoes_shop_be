import { Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';
import { Products } from '../entities';
import { Paginator } from '~/databse/Paginator';
import productsServices from '~/services/Products.services';

export class ProductsController {
    async getMenProducts(req: Request, res: Response): Promise<Response> {
        const { option } = req.query;
        const type =
            option === 'lifestyle'
                ? 1
                : option === 'original'
                  ? 2
                  : option === 'basketball'
                    ? 3
                    : option === 'football'
                      ? 4
                      : option === 'running'
                        ? 5
                        : option === 'adidas'
                          ? 6
                          : 7;
        if (option === 'all') {
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'men' });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get men products success',
                data: products,
                paginationInfo,
            });
        } else if (type !== 6 && type !== 7) {
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'men' })
                .andWhere('products.category_id = :category_id', { category_id: type });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get men products success',
                data: products,
                paginationInfo,
            });
        } else {
            const brand_id = type === 6 ? 1 : 2;
            console.log(brand_id, type);
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'men' })
                .andWhere('products.brand_id = :brand_id', { brand_id });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get men products success',
                data: products,
                paginationInfo,
            });
        }
    }

    async getWomenProducts(req: Request, res: Response): Promise<Response> {
        const { option } = req.query;
        const type =
            option === 'lifestyle'
                ? 1
                : option === 'original'
                  ? 2
                  : option === 'basketball'
                    ? 3
                    : option === 'football'
                      ? 4
                      : option === 'running'
                        ? 5
                        : option === 'adidas'
                          ? 6
                          : 7;
        if (option === 'all') {
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'women' });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get women products success',
                data: products,
                paginationInfo,
            });
        } else if (type !== 6 && type !== 7) {
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'women' })
                .andWhere('products.category_id = :category_id', { category_id: type });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get women products success',
                data: products,
                paginationInfo,
            });
        } else {
            const brand_id = type === 6 ? 2 : 1;
            const queryBuilder = AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .where('products.gender_type = :gender_type', { gender_type: 'women' })
                .andWhere('products.brand_id = :brand_id', { brand_id });

            const { records: products, paginationInfo } = await Paginator.paginate(
                queryBuilder,
                req,
            );
            if (!products) {
                return res.status(404).json({
                    success: false,
                    msg: 'Cant not get any products',
                });
            }
            return res.status(200).json({
                success: true,
                msg: 'Get women products success',
                data: products,
                paginationInfo,
            });
        }
    }

    async getProductsByOption(req: Request, res: Response) {
        const { option, pageSize } = req.query;
        const { status, message, data } = await productsServices.getProductsByOption(
            option as string,
            Number(pageSize),
        );
        return res.status(status).json({
            message,
            data,
        });
    }

    async getProductById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await AppDataSource.getRepository(Products).findOneByOrFail({ id });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: 'Products you are looking for does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Get product success',
                data: product,
            });
        } catch (error) {
            throw new Error();
        }
    }
}
