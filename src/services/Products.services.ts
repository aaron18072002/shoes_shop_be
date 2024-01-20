import { AppDataSource } from '~/databse/data-source';
import { Products } from '~/entities';

class ProductsServcies {
    async getProductsByOption(option: string, pageSize: number) {
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
            const products = await AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .take(Number(pageSize))
                .getMany();

            if (!products) {
                return {
                    status: 404,
                    message: 'Cant not get any products',
                };
            }
            return {
                status: 200,
                message: 'Get all products success',
                data: products,
            };
        } else if (type !== 6 && type !== 7) {
            const products = await AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .andWhere('products.category_id = :category_id', { category_id: type })
                .take(Number(pageSize))
                .getMany();

            if (!products) {
                return {
                    status: 404,
                    message: 'Cant not get any products',
                };
            }
            return {
                status: 200,
                message: 'Get products success',
                data: products,
            };
        } else {
            const brand_id = type === 6 ? 1 : 2;
            const products = await AppDataSource.getRepository(Products)
                .createQueryBuilder('products')
                .andWhere('products.brand_id = :brand_id', { brand_id })
                .take(Number(pageSize))
                .getMany();

            if (!products) {
                return {
                    status: 404,
                    message: 'Cant not get any products',
                };
            }
            return {
                status: 200,
                message: 'Get products success',
                data: products,
            };
        }
    }
}

const productsServices = new ProductsServcies();

export default productsServices;
